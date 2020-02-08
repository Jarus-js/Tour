const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
//models
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generating jwtoken => identifying piece of info created including user id & secret
const tokenForUser = user =>
  jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_KEY, {
    expiresIn: "7d"
  });

const getAllUser = (req, res, next) => {
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
    return next(new HttpError("Invalid input passed", 422));
  }
  const { name, email, password } = req.body;

  User.findOne({ email }).then(userEmail => {
    if (userEmail) {
      return res.status(422).json({ message: "Email is in use" });
    }
    bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        console.log("Req signup", req.file);
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          image: req.file.path,
          places: []
        }); //new instance of user
        newUser
          .save()
          .then(user => {
            res.status(201).json({
              userId: user.id,
              email: user.email,
              token: tokenForUser(user)
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }); //findOne
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      console.log("loginUser", user);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Inavalid Credentials or User not found" }); //auth failed i.e 401
      }
      bcrypt
        .compare(password, user.password)
        .then(matchedPw => {
          return res.json({
            message: "Login Success",
            user: user.toObject({ getters: true }),
            token: tokenForUser(user)
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => {
      console.log("mistake", err);
      return next(new HttpError("Something went wrong", 500));
    });
};

exports.getAllUser = getAllUser;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
