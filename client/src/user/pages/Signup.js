import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/components/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from "../../shared/components/utils/validators";
import "./Auth.css";
const Auth = () => {
  // const [isLoginMode, setIsLoginMode] = useState(true);
  //useForm returns formState,InputHandler
  const [formState, InputHandler] = useForm(
    {
      //useForm arguments i.e inputs: initialInputs,isValid: initialFormValidity
      name: {
        value: "",
        isValid: false
      },
      email: {
        value: "", //depends upon state of Input
        isValid: false //depends upon state of Input
      },
      password: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const authSubmitHandler = e => {
    e.preventDefault();
    console.log(formState.inputs);
  };

  return (
    <Card className="authentication">
      <form className="place-form" onSubmit={authSubmitHandler}>
        <Input
          elements="input"
          id="name"
          type="text"
          label="Name:"
          placeholder="Enter your name"
          errorText="Please enter name"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
        />
        <Input
          elements="input"
          id="email"
          type="email"
          label="Email:"
          placeholder="Enter your email"
          errorText="Please enter valid email"
          validators={[VALIDATOR_EMAIL()]}
          onInput={InputHandler}
        />
        <Input
          elements="input"
          id="password"
          type="password"
          label="password:"
          placeholder="Enter your password"
          errorText="Please enter valid password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={InputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          SIGNUP
        </Button>
      </form>
      <Link to="/login">Already have an Account ? Login</Link>
    </Card>
  );
};

export default Auth;
