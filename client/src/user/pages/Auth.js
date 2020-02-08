import React, { useState, useContext, Fragment } from "react";
import { AuthContext } from "../../shared/components/context/auth-Context";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/components/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH
} from "../../shared/components/utils/validators";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import "./Auth.css";
const Auth = () => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const history = useHistory();
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

  const authSubmitHandler = e => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/user/login", {
        email: formState.inputs.email.value,
        password: formState.inputs.password.value
      })
      .then(response => {
        console.log("loginResponse", response);
        auth.login(response.data.user.id, response.data.token);
        history.push(`/${auth.userId}/places`);
      })
      .catch(err => {
        console.log(err);
        setError(err.response);
      });
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
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
    </Fragment>
  );
};

export default Auth;
