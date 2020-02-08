import React, { Fragment, useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/components/utils/validators";
import { useForm } from "../../shared/components/hooks/form-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/components/context/auth-Context";
import "./PlaceForm.css";

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
    {
      //inputs:inputData
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
      address: { value: "", isValid: false }
    },
    false //formIsValid:formValidity
  );

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/place/${placeId}`)
      .then(response => {
        console.log("getPlaceByPlaceId", response);
        setLoadedPlace(response.data.placeById);
        setFormData(
          {
            title: { value: response.data.placeById.title, isValid: true },
            description: {
              value: response.data.placeById.description,
              isValid: true
            },
            address: { value: response.data.placeById.address, isValid: true }
          },
          true
        );
      })
      .catch(err => {
        console.log(err, err.response);
        setError(err.response.data.message);
      });
  }, []);

  const placeUpdateSubmitHandler = e => {
    e.preventDefault();
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/place/${placeId}`,
        {
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value
        },
        {
          headers: {
            Authorization: "Bearer " + auth.token
          }
        }
      )
      .then(response => {
        console.log("updatedPlace", response);
        history.push(`/${auth.userId}/places`);
      })
      .catch(err => {
        console.log(err, err.response);
        setError(err.response.data.message);
      });
  };

  const errorHandler = () => {
    setError(null);
  };

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <h2>Could not find places.</h2>
      </div>
    );
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            elements="input"
            id="title"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter valid title"
            onInput={inputHandler}
            initialValue={loadedPlace.title} //from input component state
            initialIsValid={true}
          />
          <Input
            elements="input"
            id="address"
            type="text"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter valid address"
            onInput={inputHandler}
            initialValue={loadedPlace.address} //from input component state
            initialIsValid={true}
          />
          <Input
            elements="textarea"
            id="description"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Description must be @ least 5 char long."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialIsValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </Fragment>
  );
};

export default UpdatePlace;
