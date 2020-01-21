const router = require("express").Router();
const { check } = require("express-validator");

const userControllers = require("../controllers/user-controller");

// =>/api/user/all
router.get("/all", userControllers.getAllUser);
// =>/api/user/signup
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .normalizeEmail() //turns to small
      .not()
      .isEmpty(),
    check("password").isLength({
      min: 5
    })
  ],
  userControllers.userSignup
);
// =>/api/user/login
router.post("/login", userControllers.userLogin);

module.exports = router;
