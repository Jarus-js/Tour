const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrappers in the world",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St,New York,NY 10001",
    location: {
      lat: 40.7884405,
      lng: -73.9878584
    },
    creator: "u1"
  }
];

const getPlaceByPlaceId = (req, res) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find(p => p.id === placeId); //find return first matching items in the form of true & find doesn't create copy of array
  if (!place) {
    const error = new Error("Place not found");
    error.code = 404;
    throw error; //throw cancel func execution after that
  }
  res.json({
    place
  });
};
//One user can have many places visited list so we use filter as filter returns every items whereas find just return first matching items
const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const userPlaces = DUMMY_PLACES.filter(p => p.creator === userId);
  if (!userPlaces || userPlaces.length === 0) {
    const error = new Error("User Place not found");
    error.code = 404;
    return next(error);
  }
  res.json({
    userPlaces
  });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req); //this func looks in req & see if there's any validation error & if there's then it returns errors
  if (!errors.isEmpty()) {
    console.log("Mistake", errors);
    const errMsg = errors.array().map(error => error.msg);
    return res.status(422).json({ errors: errMsg });
  }
  const { title, description, address, creator, coordinates } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    address,
    creator,
    location: coordinates
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
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
