const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

//model
const Place = require("../models/Place");
const User = require("../models/User");

getAllPlaces = (req, res, next) => {
  Place.find({})
    .then(places => {
      return res.json({
        places: places.map(place => place.toObject({ getters: true }))
      });
    })
    .catch(err => {
      return next(new HttpError("Fetching user failed", 500));
    });
};

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
        //return next(new HttpError("User place not found", 404));
        return res.status(404).json({
          message: "Yet you haven't created any place.Maybe create new ?"
        });
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
  console.log("authReq", req.userData);
  const errors = validationResult(req); //this func looks in req & see if there's any validation error & if there's then it returns errors
  if (!errors.isEmpty()) {
    //console.log("Mistake", errors);
    const errMsg = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: errMsg });
  }
  const { title, description, address } = req.body;
  console.log("Req Add place", req.file);
  const createdPlace = new Place({
    title,
    description,
    address,
    image: req.file.path,
    creator: req.userData.userId
  });
  User.findById(req.userData.userId) //we pass user id here
    .then(user => {
      console.log("first", user);
      if (!user) {
        return next(new HttpError("Couldnot find user id", 404));
      }
      user.places.push(createdPlace.id);
      user.save().then(() => console.log("userId added to places"));
      console.log("final", user);
    });
  createdPlace
    .save()
    .then(places => {
      console.log("saved place", places);
      return res.json({
        createdPlace: places.toObject({ getters: true })
      });
    })
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
  console.log("req", req.userData.userId);
  const { title, description, address } = req.body;
  const placeId = req.params.placeId;
  Place.findById(placeId)
    .then(place => {
      if (place.creator == req.userData.userId) {
        place.title = title;
        place.description = description;
        place.address = address;
        place
          .save()
          .then(() => {
            res
              .status(200)
              .json({ updatePlace: place.toObject({ getters: true }) });
          })
          .catch(err => console.log(err));
      } else {
        return next(
          new HttpError("You are not allowed to edit this place", 401)
        );
      }
    })
    .catch(err => {
      clg("catch", err);
      return next(new HttpError("Something went wrong", 500));
    });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  Place.findById(placeId)
    .populate("creator")
    .then(place => {
      //console.log("populate-place", place);
      if (place.creator.id == req.userData.userId) {
        place
          .remove()
          .then(() => {
            res.status(200).json({ message: "Place succesfully deleted" });
          })
          .catch(err => {
            next(new HttpError("Couldnot delete place"));
          });
        console.log("before pull", place.creator.places);
        place.creator.places.pull(place);
        console.log("after pull", place.creator.places);
        place.creator
          .save()
          .then(() => {
            res.json({ message: "Removed from places array" });
          })
          .catch(err => console.log(err));
      } else {
        return next(
          new HttpError("You are not allowed to delete this place", 401)
        );
      }
    })
    .catch(err => {
      console.log("catch", err);
      return next(new HttpError("Something went wrong", 500));
    });
};

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
exports.getAllPlaces = getAllPlaces;
