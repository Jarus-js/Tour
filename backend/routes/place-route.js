const router = require("express").Router();
const { check } = require("express-validator");
//Contorllers
const placeController = require("../controllers/place-controller");

// =>/api/place/:placeId
router.get("/:placeId", placeController.getPlaceByPlaceId);

//=>/api/place/user/:userId
router.get("/user/:userId", placeController.getPlacesByUserId);

//=>/api/place/create
router.post(
  "/create",
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
