const uuid = require("uuid/v4");
const DUMMY_PLACES = [
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

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const userPlace = DUMMY_PLACES.find(p => p.creator === userId);
  if (!userPlace) {
    const error = new Error("User Place not found");
    error.code = 404;
    return next(error);
  }
  res.json({
    userPlace
  });
};

const createPlace = (req, res, next) => {
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

exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
