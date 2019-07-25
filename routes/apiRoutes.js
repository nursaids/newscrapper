const db = require("../models");
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