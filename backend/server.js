const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
//Storing express function in app var;
const app = express();

//Middlewares
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads/images", express.static(path.join("uploads", "images")));
//Error handling middleware
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log("unlink", err);
    });
  }
  if (res.headerSent) {
    return next(error); //if res is already sent with some defined error msg i.e only one res can be sent at a time
  }
  //if res is not send
  res.status(error.code || 500); //500 i.e sth went wrong on server
  res.json({ message: error.message || "An unknown error occured" });
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

//Routes
app.use("/api/user", require("./routes/user-route"));
app.use("/api/place", require("./routes/place-route"));
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.code = 404;
  return next(error);
});

//mongoose connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-xizht.mongodb.net/tourPlaces?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    })
  )
  .catch(err => console.log(err));
