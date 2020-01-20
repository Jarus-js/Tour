import React from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/components/hooks/form-hook";
import "./PlaceForm.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/components/utils/validators";
const NewPlace = () => {
  //useForm returns formState,InputHandler
  const [formState, InputHandler] = useForm(
    {
      //useForm arguments i.e inputs: initialInputs,isValid: initialFormValidity
      title: {
        value: "", //depends upon state of Input
        isValid: false //depends upon state of Input
      },
      description: {
        value: "",
        isValid: false
      },
      address: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const placeSubmitHandler = e => {
    e.preventDefault();
    console.log(formState.inputs);
    //formState.inputs i.e initial inputs
    //formState.isValid i.e initial form validity
  };
  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        elements="input"
        type="text"
        label="Title:"
        placeholder="Please enter title"
        errorText="Please enter valid title"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={InputHandler} //props.onInput(id, value, isValid); //props.id,inputState.value,inputState.isValid
        //InputHanlder dispatch actiontype INPUT_CHANGE which updates states with id:inputId,value,isValid
      />
      <Input
        id="description"
        elements="textarea"
        type="text"
        label="Description:"
        placeholder="Details"
        errorText="Description must be at least 5 char long"
        validators={[VALIDATOR_MINLENGTH(5)]}
        onInput={InputHandler}
        //disabled={!formState.isValid}
      />
      <Input
        id="address"
        elements="input"
        type="text"
        label="Address:"
        placeholder="Address"
        errorText="Please enter valid address"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={InputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;
