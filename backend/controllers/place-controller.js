const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
//model
const Place = require("../models/Place");
const User = require("../models/User");

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
    title,
    description,
    address,
    imageUrl:
      "https://www.nepalsocialtreks.com/wp-content/uploads/2019/08/Balthali-Village-Trek.jpg",
    creator
  });
  User.findById(creator) //we pass user id here
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
  const { title, description, address } = req.body;
  const placeId = req.params.placeId;
  Place.findById(placeId)
    .then(place => {
      place.title = title;
      place.description = description;
      place.address = address;
      place.save().then(() => {
        return res
          .status(200)
          .json({ updatePlace: place.toObject({ getters: true }) });
      });
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
      if (!place) {
        return next(new HttpError("Couldnot find place", 404));
      }
      place
        .remove()
        .then(() => {
          res.status(200).json({ message: "Place succesfully deleted" });
        })
        .catch(err => {
          return next(new HttpError("Couldnot delete place"));
        });
      console.log("before pull", place.creator.places);
      place.creator.places.pull(place);
      console.log("after pull", place.creator.places);
      place.creator.save().then(() => {
        return res.json({ message: "Removed from places array" });
      });
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

/*
 mongoose
        .startSession()
        .then(session => {
          session.startTransaction();
          createdPlace.save({ session }).then(() => {
            console.log("inside", user);
            console.log("createdplace", createdPlace);
            user.places.push(createdPlace);
          }); //user id to places
          user.save({ session }).then(() => session.commitTransaction());
          res.json({ place: createdPlace });
        })
     
*/
