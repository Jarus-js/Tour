const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
//models
const User = require("../models/User");

const getAllUser = (req, res) => {
  User.find({}, "-password")
    .then(users => {
      return res.json({
        users: users.map(user => user.toObject({ getters: true }))
      });
    })
    .catch(err => {
      return next(new HttpError("Fetching user failed", 500));
    });
};

const userSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMsg = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: errMsg });
  }
  const { name, email, password, imageUrl } = req.body;

  User.findOne({ email }).then(userEmail => {
    if (userEmail) {
      return res.status(422).json({ message: "Email is in use" });
    }
  });

  const newUser = new User({
    name,
    email,
    password,
    places: [],
    imageUrl:
      "https://scontent.fktm8-1.fna.fbcdn.net/v/t1.0-9/78950153_1714169562052257_5290771419381104640_n.jpg?_nc_cat=105&_nc_ohc=52tvYcaabN0AQkJOk4Uhg5KYOx-NTZ50Yy_E3Hg6qL--jOz8OlZoX80HA&_nc_ht=scontent.fktm8-1.fna&oh=f0bc213fd9a700538d0490cef1b988e9&oe=5EA5ADFB"
  });
  newUser
    .save()
    .then(user =>
      res.status(201).json({ newUser: user.toObject({ getters: true }) })
    )
    .catch(err => {
      return next(new HttpError("Something went wrong", 500));
    });
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user || user.password !== password) {
        return next(new HttpError("Invalid Credentials", 401)); //auth failed i.e 401
      }
      res.json({ message: "Login Success" });
    })
    .catch(err => {
      console.log("mistake", err);
      return next(new HttpError("Something went wrong", 500));
    });
};

exports.getAllUser = getAllUser;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
