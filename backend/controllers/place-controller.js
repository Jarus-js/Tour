const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
//model
const Place = require("../models/Place");

const getPlaceByPlaceId = (req, res, next) => {
  const placeId = req.params.placeId;
  Place.findById(placeId)
    .then(place => {
      if (!place) {
        return next(new HttpError("Place not found", 404));
      }
      res.json({ placeById: place.toObject({ getters: true }) });
      //converting to normal js obj & removing _ from _id
    })
    .catch(err => {
      console.log("catch", err);
      return next(new HttpError("Something went wrong", 500));
    });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;
  Place.find({ creator: userId }) //find return array
    .then(userPlace => {
      if (!userPlace || userPlace.length === 0) {
        return next(new HttpError("User place not found", 404));
      }
      res.json({
        userPlaces: userPlace.map(place => place.toObject({ getters: true }))
      });
    })
    .catch(err => {
      console.log("catch", err);
      return next(new HttpError("Fethcing place went wrong", 500));
    });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req); //this func looks in req & see if there's any validation error & if there's then it returns errors
  if (!errors.isEmpty()) {
    //console.log("Mistake", errors);
    const errMsg = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: errMsg });
  }
  const { title, description, address, imageUrl, creator } = req.body;
  const createdPlace = new Place({
    //New instance of model
    title,
    description,
    address,
    imageUrl:
      "https://www.nepalsocialtreks.com/wp-content/uploads/2019/08/Balthali-Village-Trek.jpg",
    creator
  });
  createdPlace
    .save() //before saving make new instance of model
    .then(newPlace => res.status(201).json({ createdPlace: newPlace }))
    .catch(err => {
      clg("catch", err);
      return next(new HttpError("Something went wrong", 500));
    });
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMsg = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: errMsg });
  }
  const { title, description, address } = req.body;
  const placeId = req.params.placeId;
  const matchPlace = { ...DUMMY_PLACES.find(place => place.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId);
  matchPlace.title = title;
  matchPlace.description = description;
  matchPlace.address = address;
  DUMMY_PLACES[placeIndex];
  res.status(200).json({ place: matchPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  if (DUMMY_PLACES.find(place => place.id !== placeId)) {
    const error = new Error("User Place not found unable to delete");
    error.code = 404;
    return next(error);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeId);
  res.status(200).json({ message: "Place succesfully deleted" });
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
