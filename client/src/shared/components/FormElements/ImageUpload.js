import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";
const ImageUpload = props => {
  const [file, setFile] = useState(); //e.target.files[0];
  const [previewUrl, setPreviewUrl] = useState(); //fileReader.result
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    //when sth in state change we use useEffect hooks
    //Generating preview
    console.log("file changed");
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

  //Goal is to generate sth that helps to preview file down in img src
  const pickedHandler = e => {
    let pickedFiles;
    let fileIsValid = isValid;
    //Checking we have file & its exactly one
    if (e.target.files && e.target.files.length === 1) {
      //files property that holds file user select
      //files i.e built-in
      pickedFiles = e.target.files[0];
      setFile(pickedFiles); //file
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFiles, fileIsValid);
  };

  const pickImageHandler = () => {
    //opens built-in file picker
    //to simulate click on this get access to input elements & call its click method
    filePickerRef.current.click(); //click() i.e method.
  };
  return (
    <div className="form-control">
      <input
        type="file"
        id={props.id}
        style={{ display: "none" }}
        accept=".jpg,.jpeg,.png" //default attribute
        ref={filePickerRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;

//When custom button gets clicked file picker opens & when user choose file onChange fires
