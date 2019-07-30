const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

//home page
router.get("/", (req, res) => {
    Article
        .find({})
        .where("saved").equals(false)
        .where("deleted").equals(false)
        .sort("-date")
        .limit(20)
        .exec((error, articles) => {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                let hbsObj = {
                    title: "Daily Sports News ",
                    subtitle: "New York Times ",
                    articles: articles
                };
                res.render("index", hbsObj);
            }
        });
});

//saved articles
router.get("/saved", (req, res) => {
    Article
        .find({})
        .where("saved").equals(true)
        .where("deleted").equals(false)
        .populate("notes")
        .sort("-date")
        .exec((error, articles) => {
            if (error) {
                console.log(error);
                res.status(500);
            } else {
                console.log(articles);
                let hbsObj = {
                    title: "Your Saved News",
                    subtitle: "New York Times Sports",
                    articles: articles 
                };
                res.render("saved", hbsObj);
            }
        });
});

router.use("/api", require("./api"));

module.exports = router;