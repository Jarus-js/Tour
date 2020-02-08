import React, { Fragment, useRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/components/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from "../../shared/components/utils/validators";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
//import sendHttpRequest from "../../shared/components/utils/httpRequest";
//import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./Auth.css";
import "./Signup.css";
const Auth = () => {
  const [file, setFile] = useState(); //e.target.files[0];
  const [previewUrl, setPreviewUrl] = useState(); //fileReader.result
  const [error, setError] = useState();
  const history = useHistory();
  //useForm returns formState,InputHandler
  const [formState, InputHandler, setFormData] = useForm(
    {
      //useForm arguments i.e inputs: initialInputs,isValid: initialFormValidity
      name: { value: "", isValid: false },

      email: {
        value: "", //depends upon state of Input
        isValid: false //depends upon state of Input
      },
      password: { value: "", isValid: false },
      image: { value: null, isValid: false }
    },
    false
  );

  //FILE UPLOAD
  const filePickerRef = useRef();
  useEffect(() => {
    //when sth in state change we use useEffect hooks
    //Generating preview
    if (!file) {
      //e.target.files[0]
      return;
    }
    const fileReader = new FileReader(); //api built in browser i.e helps read,parse file
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result); //previewUrl
    };
    fileReader.readAsDataURL(file); //command to create url
  }, [file]); //Whenever file changes this func executes
  //console.log("stateUrl", previewUrl);

  //Goal is to generate sth that helps to preview file down in img src
  const pickedHandler = e => {
    let pickedFiles;
    //Checking we have file & its exactly one
    if (e.target.files && e.target.files.length === 1) {
      //files property that holds file user select
      //files i.e built-in
      pickedFiles = e.target.files[0];
      return setFile(pickedFiles); //file
    }
    //onInput(id, pickedFiles, fileIsValid);
  };
  console.log("stateFile", file);
  const pickImageHandler = () => {
    //opens built-in file picker
    //to simulate click on this get access to input elements & call its click method
    filePickerRef.current.click(); //click() i.e method.
  };
  //END FILEUPLOAD
  const authSubmitHandler = e => {
    e.preventDefault();
    console.log("Inputs", formState.inputs);
    const formData = new FormData();
    formData.append("name", formState.inputs.name.value);
    formData.append("email", formState.inputs.email.value);
    formData.append("password", formState.inputs.password.value);
    formData.append("image", file);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/user/signup", formData)
      .then(response => {
        console.log("axios post", response);
        history.push("/login");
      })
      .catch(err => {
        console.log(err, err.response);
        setError(err.response.data.message);
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
          <input
            type="file"
            id="image"
            style={{ display: "none" }}
            accept=".jpg,.jpeg,.png" //default attribute
            ref={filePickerRef}
            onChange={pickedHandler}
          />
          <div className={`image-upload`}>
            <div className="image-upload__preview">
              {previewUrl && <img src={previewUrl} alt="preview" />}
              {!previewUrl && <p>Please pick an image</p>}
            </div>
            <Button type="button" onClick={pickImageHandler}>
              PICK IMAGE
            </Button>
          </div>

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
          <Button type="submit">SIGNUP</Button>
        </form>
        <Link to="/login">Already have an Account ? Login</Link>
      </Card>
    </Fragment>
  );
};

export default Auth;

//<ImageUpload id="image" onInput={InputHandler} center />
