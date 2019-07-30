const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: "Summary not available."
    },
    // link is type string and required
    link: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    // note is object that stores a Note id. The ref property links the ObjectId to the Note model and allows us to populate the Article with an associated Note
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note",
        required: false
    }]
    
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;