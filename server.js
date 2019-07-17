const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");


const db = require("./models");

const PORT = (process.env.PORT || 3000);

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/entrepreneur";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});


/*
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/entrepreneur", { useNewUrlParser: true });
*/

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Start the server
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
