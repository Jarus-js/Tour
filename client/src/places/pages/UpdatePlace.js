import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/components/utils/validators";
import { useForm } from "../../shared/components/hooks/form-hook";
import "./PlaceForm.css";
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

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      //inputs:inputData
      title: { value: "", isValid: false },
      description: { value: "", isValid: false }
    },
    false //formIsValid:formValidity
  );

  const identifiedPlaces = DUMMY_PLACES.find(places => places.id === placeId);

  useEffect(() => {
    if (identifiedPlaces) {
      setFormData(
        {
          title: { value: identifiedPlaces.title, isValid: true },
          description: { value: identifiedPlaces.description, isValid: true }
        },
        true
      );
    }
  }, [setFormData, identifiedPlaces]);

  const placeUpdateSubmitHandler = e => {
    e.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlaces) {
    return (
      <div className="center">
        <h2>Could not find places.</h2>
      </div>
    );
  }
  if (!formState.inputs.title.value) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }
  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        elements="input"
        id="title"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter valid title"
        onInput={inputHandler}
        initialValue={formState.inputs.title.value} //from input component state
        initialIsValid={formState.inputs.title.isValid}
      />
      <Input
        elements="textarea"
        id="description"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Description must be @ least 5 char long."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialIsValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
