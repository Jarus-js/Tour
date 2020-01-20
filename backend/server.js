const express = require("express");
const bodyParser = require("body-parser");

//Storing express function in app var;
const app = express();

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Error handling middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error); //if res is already sent with some defined error msg i.e only one res can be sent at a time
  }
  //if res is not send
  res.status(error.code || 500); //500 i.e sth went wrong on server
  res.json({ message: error.message || "An unknown error occured" });
});

//Routes
app.use("/api/user", require("./routes/user-route"));
app.use("/api/place", require("./routes/place-route"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
