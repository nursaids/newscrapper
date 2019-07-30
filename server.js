const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

//scrping tools
const axios = require("axios");
const cheerio = require("cheerio");

//require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

//initialize express
const app = express();

//configure middleware

//use morgan logger for logging requests
app.use(logger("dev"));
//parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//make public a static folder
app.use(express.static("public"));
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

//connect to the Mongo DB - if deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
 });

//routes
const routes = require("./routes/index");
app.use(routes);

// start the server
app.listen(PORT, () => {
  console.log(
      `===> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`
  );
});