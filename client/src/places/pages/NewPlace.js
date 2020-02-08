import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
  useContext
} from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/components/hooks/form-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/components/context/auth-Context";
import "./PlaceForm.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/components/utils/validators";
const NewPlace = () => {
  const auth = useContext(AuthContext);
  const [file, setFile] = useState(); //e.target.files[0];
  const [previewUrl, setPreviewUrl] = useState(); //fileReader.result
  const [error, setError] = useState();
  const history = useHistory();
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
      },
      image: {
        value: null,
        isValid: false
      }
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
  };
  console.log("stateFile", file);
  const pickImageHandler = () => {
    //opens built-in file picker
    //to simulate click on this get access to input elements & call its click method
    filePickerRef.current.click(); //click() i.e method.
  };
  //END FILEUPLOAD

  const placeSubmitHandler = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("address", formState.inputs.address.value);
    formData.append("image", file);
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/place/create", formData, {
        headers: {
          Authorization: "Bearer " + auth.token
        }
      })
      .then(response => {
        console.log("createPlaceResponse", response);
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

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
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

        <Button type="submit">ADD PLACE</Button>
      </form>
    </Fragment>
  );
};

export default NewPlace;
