import React, { Fragment, useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import PlaceList from "../components/PlaceList";
import { AuthContext } from "../../shared/components/context/auth-Context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UserPlace = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [error, setError] = useState();
  const [places, setPlaces] = useState();
  //const userId = useParams().userId; //route

  useEffect(() => {
    axios
      //.get(`http://localhost:5000/api/place/user/${auth.userId}`)
      .get(process.env.REACT_APP_BACKEND_URL + "/place/all")
      .then(response => {
        console.log("allPlaces", response);
        setPlaces(response.data.places);
      })
      .catch(err => {
        console.log(err, err.response);
        setError(err.response.data.message);
      });
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  const placeDeletedHandler = deletedPlaceId => {
    setPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {places && (
        <PlaceList items={places} onDeletePlace={placeDeletedHandler} />
      )}
    </Fragment>
  );
};

export default UserPlace;
