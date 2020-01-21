const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
let USERS = [
  {
    user_id: "u1",
    name: "Jarus",
    email: "asuraj20@yahoo.com",
    password: "pulsar220f."
  }
];

const getAllUser = (req, res) => {
  res.status(200).json({ users: USERS });
};

const userSignup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMsg = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: errMsg });
  }
  const { name, email, password } = req.body;

  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(422).json({ message: "Email is in use" });
  }
  const newUser = { id: uuid(), name, email, password };
  USERS.push(newUser);
  res.status(201).json(newUser);
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = USERS.find(user => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new Error("Invalid Credentials");
    error.code = 401; //auth failed i.e 401
    return next(error);
  }
  res.json({ message: "Login Success" });
};

exports.getAllUser = getAllUser;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
