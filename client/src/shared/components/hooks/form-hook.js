import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  //Inside reducer initial state is updated based on diff action we received
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        //inputId i.e title,description
        if (inputId === action.inputId) {
          //title === title
          //true => action.inputId ma j dispatch gareko xa tehi rakhdine formIsValid ma
          formIsValid = formIsValid && action.isValid;
        } else {
          //false => formIsValid ma isValid ko initial value rakhxam i.e false
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
          /*title:{ //Mathi ko yesto ho.
            value:e.target.value,
            isValid:validate()
        }*/
        },
        isValid: formIsValid //reducer logic
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    //Initial state
    inputs: initialInputs,
    isValid: initialFormValidity
  });

  //In this funct if we do anything that changes state of NewPlace component & re-render it
  //New titleInputHandler func gets created
  const InputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id, //title,description
      value: value,
      isValid: isValid
    });
  }, []); //if component re-renders new funct wont be created i.e re-use  old funct

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity
    });
  }, []);
  return [formState, InputHandler, setFormData];
}; //useForm
