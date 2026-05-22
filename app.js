const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Customer = require("./models/customerSchema");
const moment = require("moment");
const app = express();
const port = 3000;

// automatically refresh
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public")); // 👈 this was missing

app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
//////////////////////////////////////////////////////////////

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); // for parsing the data arrivs from the form from a string name=John&age=25&city=Paris , to an usable object
app.use(methodOverride("_method"));

// activating the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// database connection
mongoose
  .connect(
    "mongodb://nodehaitem:nodehaitem123@ac-aolqphm-shard-00-00.ptyluhu.mongodb.net:27017,ac-aolqphm-shard-00-01.ptyluhu.mongodb.net:27017,ac-aolqphm-shard-00-02.ptyluhu.mongodb.net:27017/devhaitem?ssl=true&replicaSet=atlas-xb622x-shard-0&authSource=admin&appName=Cluster0",
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// getting the data , and render it in home page.
app.get("/index.html", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.render("index", { customers, moment });
  } catch (err) {
    console.log(err);
  }
});

/////////////////////////////////////////////////////////////////////
//getters
/////////////////////////////////////////////////////////////////////

// adding users page
app.get("/user/add.html", async (req, res) => {
  res.render("user/add");
});

app.get("/edit/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.render("user/edit", { customer, moment });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    res.render("user/view", { customer, moment });
  } catch (err) {
    console.log(err);
  }
});

/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
//posters
/////////////////////////////////////////////////////////////////////

// sending the data to the database
app.post("/user/add.html", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.render("user/add");
  } catch (err) {
    console.log(err);
  }
});

// put request
app.put("/edit/:id", async (req, res) => {
  try {
    await Customer.updateOne({ _id: req.params.id }, { $set: req.body });
    console.log("Updated");
    res.redirect("/index.html");
  } catch (err) {
    console.log(err);
  }
});

// delete request

app.delete("/delete/:id", async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    console.log("Deleted");
    res.redirect("/index.html");
  } catch (err) {
    console.log(err);
  }
});

// search request

app.post("/search", async (req, res) => {
  try {
    console.log(req.body.searchText);
    const customers = await Customer.find({ firstName: req.body.searchText });

    res.render("user/search", { customers, moment });
  } catch (err) {
    console.log(err);
  }
});
