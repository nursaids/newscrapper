const express = require('express');
const router = express.Router();
const Article = require("../../models/Article");
const Note = require("../../models/Note");

//get all notes
router.get("/", (req, res) => {
    Note
        .find({})
        .exec((err, notes) => {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                res.status(200).json(notes);
            }
        });
});

//add a note to a saved article
router.post("/:id", (req, res) => {
    let newNote = new Note(req.body);
    //console.log(req.body);
    newNote.save((err, doc) => {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { "notes": doc.id } },
                (error, newDoc) => {
                    if (error) {
                        console.log(error);
                        res.status(500);
                    } else {
                        res.redirect("/saved");
                    }
                }
            );
        }
    });
});

//delete a note from a saved article
router.post("/delete/:id", (req, res) => {
    Note.findByIdAndRemove(req.params.id, (err, note) => {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            res.redirect("/saved");
        }
    });
});

module.exports = router;