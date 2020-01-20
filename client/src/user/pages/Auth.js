import React, { useState, useContext } from "react";
import { AuthContext } from "../../shared/components/context/auth-Context";

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
  const auth = useContext(AuthContext);

  // const [isLoginMode, setIsLoginMode] = useState(true);
  //useForm returns formState,InputHandler
  const [formState, InputHandler] = useForm(
    {
      //useForm arguments i.e inputs: initialInputs,isValid: initialFormValidity
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

  // const switchModeHandler = () => {
  //   setIsLoginMode(prevMode => !prevMode); //true vaye false,false vaye true
  // };

  const authSubmitHandler = e => {
    e.preventDefault();
    console.log(formState.inputs);
    auth.login();
  };

  return (
    <Card className="authentication">
      <form className="place-form" onSubmit={authSubmitHandler}>
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
          LOGIN
        </Button>
      </form>
      <Link to="/signup">Don't have an Account ? Signup</Link>
    </Card>
  );
};

export default Auth;
