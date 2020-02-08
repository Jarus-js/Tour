const router = require("express").Router();
const { check } = require("express-validator");
//Contorllers
const placeController = require("../controllers/place-controller");
const fileUpload = require("../middleware/fileUpload");

const checkAuth = require("../middleware/checkAuth");

//=>/api/place/all
router.get("/all", placeController.getAllPlaces);

// =>/api/place/:placeId
router.get("/:placeId", placeController.getPlaceByPlaceId);

//=>/api/place/user/:userId
router.get("/user/:userId", placeController.getPlacesByUserId);

router.use(checkAuth);
//=>/api/place/create
router.post(
  "/create",
  fileUpload.single("image"),
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address")
      .not()
      .isEmpty()
  ],
  placeController.createPlace
);

//=>/api/place/:placeId
router.patch(
  "/:placeId",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address")
      .not()
      .isEmpty()
  ],
  placeController.updatePlaceById
);

//=>/api/place/:placeId
router.delete("/:placeId", placeController.deletePlaceById);

module.exports = router;
