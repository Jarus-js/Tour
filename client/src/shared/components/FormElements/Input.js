import React, { useReducer, useEffect } from "react";
import { validate } from "../utils/validators";
import "./Input.css";

//RSA => reducer is just function that updates states based on action it receives & returns new state
const inputReducer = (state, action) => {
  switch (
    action.type //actual state kasto hunxa vanera dekhauxam
  ) {
    case "ONCHANGE":
      return {
        ...state,
        value: action.val, //dependends upon e.target.valu
        isValid: validate(action.val, action.validators)
        //depend upon validators func where validators is type of validation passed 4m props
      };
    case "ONTOUCH":
      return {
        ...state,
        isTouched: true
      };
    default:
      return state; //unchanged state
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    //inputState defines initialState i.e initialState kasto hunxa vanera dekhauxam
    //inputReducer updates the initialState i.e inputState
    value: "" || props.initialValue,
    isValid: false || props.initialIsValid, //call validate(value,validators) function
    isTouched: false
  });

  //NewPlace Form
  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    //Generally passing from child to parent
    onInput(id, value, isValid); //props.id,inputState.value,inputState.isValid
  }, [id, value, isValid, onInput]); //whenever anything changes in state or in props run this function

  const changeHandler = e => {
    dispatch({
      //action is just an object.
      type: "ONCHANGE",
      val: e.target.value,
      validators: props.validators
    });
  };

  const touchHandler = e => {
    dispatch({
      type: "ONTOUCH"
    });
  };

  const element =
    props.elements === "input" ? (
      <input
        id={props.id} //title,description
        type={props.type}
        value={inputState.value} //depends upon e.target.value
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler} //isTouched: true
      />
    ) : (
      <textarea
        id={props.id}
        type={props.type}
        value={inputState.value}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
      />
    );

  return (
    <div
      className={`form-control ${!inputState.isValid &&
        inputState.isTouched &&
        "form-control--invalid"}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;

//what user enter i.e value
//what user enter is valid or not ? i.e isValid
//Reducer is just a function which receives action that we dispatch & receives CR state & we update CR state based on action type we receive & return new state & useReducer takes that new state & give it back to us in component & re-render everything
//Reducer should always return new state
//dispatch i.e dispatch action to reducer func which runs throug reducer func which return new state that updates initalstates & re-render components
