const db = require("../models");

// Export HTML routes
module.exports = app => {
    app.get("/", (req, res) => {
        db.Article.find({})
            .then(dbArticle => res.render("index", {
                articles: dbArticle
            }))
            .catch(err => res.json(err));
    });
}