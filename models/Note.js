const mongoose = require('mongoose');

// Save reference to Schema
const Schema = mongoose.Schema;

// Create new Schema
const NoteSchema = new Schema ({
     name: {
          type: String
     },
     body: {
          type: String,
          required: true
     }
});

// creates model from the above schema
const Note = mongoose.model("Note", NoteSchema);

//export the Article model
module.exports = Note;