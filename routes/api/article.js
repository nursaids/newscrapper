const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const Article = require("../../models/Article");
const axios = require("axios");

//get all articles from database
router.get("/", function (req, res) {
    Article
        .find({})
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

//get all saved articles
router.get("/saved", function (req, res) {
    Article
        .find({})
        .where("saved").equals(true)
        .where("deleted").equals(false)
        .populate("notes")
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

//get all deleted articles
router.get("/deleted", function (req, res) {
    Article
        .find({})
        .where("deleted").equals(true)
        .exec(function (error, docs) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.status(200).json(docs);
            }
        });
});

//save an article
router.post("/save/:id", function (req, res) {
    Article.findByIdAndUpdate(req.params.id,
        { $set: { saved: true } },
        { new: true },
        function (error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect("/");
            }
        });
});

//delete a saved article
router.post("/delete/:id", function (req, res) {
    Article.findByIdAndUpdate(req.params.id,
        { $set: { deleted: true } },
        { new: true },
        function (error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect("/saved");
            }
        }
    );
});

// dismiss a scraped article
router.post('/dismiss/:id', function(req, res) {
    Article.findByIdAndUpdate(req.params.id,
        { $set: { deleted: true } },
        { new: true },
        function(error, doc) {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                res.redirect('/');
            }
        });
});

//scrape articles
router.get("/scrape", function(req, res) {
    //grab body of the html with axios
    axios.get("http://www.nytimes.com/section/sports").then(function(response) {
        //load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        //grab every article tag
        $("article").each(function(i, element) {
            //save an empty result object
            var result = {};

            //add the title, summary, link and image and save them as properties of the result object
            result.title = $(this)
                .find("h2 a")
                .text();
            result.summary = $(this)
                .find("p")
                .text();
            result.link = "http://www.nytimes.com/" + $(this)
                .find("h2 a")
                .attr("href")
            result.image = $(this)
                .find("figure img")
                .attr("src");

            //create new Article using the result object built from scraping
            Article.create(result)
                .then(function(dbArticle) {
                    //view the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    //if error occurred, log it
                    console.log(err);
                });
        });

        //send a message to the client
        res.redirect("/");
    });
});

module.exports = router;const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Scrape a page from https://www.nytimes.com/section/sports and store data into DB
 * @param {int} pageNumber
 */
function scrapePage(pageNumber) {
    // Get website
    axios.get(`https://www.nytimes.com/section/sports${pageNumber}`).then(response => {
        // Save HTML into $
        const $ = cheerio.load(response.data);
        
        
        $(".block").each((i, element) => {
            
            let title = $(element).find("h3 a").text().trim();

           
            let summary = $(element).find(".deck").text().trim();

         
            let author = $(element).find(".name").text().trim();

            
            let readTime = $(element).find(".readtime").text().trim();

            // Article link
           
            let link = `https://www.nytimes.com${$(element).find("h3 a").attr("href")}`;

            let image = $(element).parent().find("img").attr("src").trim().split("?");

           
            let articleObj = {
                title: title,
                summary: summary,
                author: author,
                readTime: readTime,
                link: link,
                image: image[0]
            };

          
            db.Article.create(articleObj)
                .then(dbArticle => console.log(dbArticle))
                .catch(err => console.log(err));
        });
    })


}

// Export API routes
module.exports = app => {
   
    app.get("/api/scrape", (req, res) => {
        scrapePage(1);

        res.send("Scrape Complete");
    });

    
    app.get("/api/articles", (req, res) => {
        db.Article.find({})
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err));
    });

    app.get("/api/articles/:id", (req, res) => {
        db.Article.findOne({ _id: req.params.id })
            .populate("comments")
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err));
    })

    app.post("/api/articles/:id", (req, res) => {
        db.Comment.create(req.body)
            .then(dbComment => db.Article.updateOne(
                { _id: req.params.id },
                { $push:
                    {
                        comments: dbComment._id
                    }
                },
                { new: true }
            ))
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err));
    });

    app.delete("/api/articles/:articleId/comments/:commentId", (req, res) => {
        db.Comment.deleteOne({ _id: req.params.commentId })
            .then(() => db.Article.update(
                { _id: req.params.articleId },
                { $pull:
                    {
                        comments: commentId
                    }
                },
                { new: true }
            ))
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err));
    });
};