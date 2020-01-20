import React from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";

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

const UserPlace = () => {
  const userId = useParams().userId; //route
  const loadedPlace = DUMMY_PLACES.filter(place => place.creator === userId); //returns new array with all elements.
  //console.log("amazing", loadedPlace);
  return <PlaceList items={loadedPlace} />;
};

export default UserPlace;
