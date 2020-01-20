const router = require("express").Router();

// =>/api/user
router.get("/", (req, res) => {
  console.log("GET Request");
  res.json({
    message: "GET request"
  });
});

module.exports = router;
