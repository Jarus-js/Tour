const router = require("express").Router();

//Contorllers
const placeController = require("../controllers/place-controller");

// =>/api/place/:placeId
router.get("/:placeId", placeController.getPlaceByPlaceId);

//=>/api/place/user/:userId
router.get("/user/:userId", placeController.getPlaceByUserId);

//=>/api/place/create
router.post('/create',placeController.createPlace);

module.exports = router;
