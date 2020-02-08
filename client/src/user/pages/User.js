import React, { useEffect, useState, Fragment } from "react";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
//import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import sendHttpRequest from "../../shared/components/utils/httpRequest";

const User = () => {
  //const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUser, setLoadedUser] = useState();
  useEffect(() => {
    sendHttpRequest("GET", process.env.REACT_APP_BACKEND_URL + "/user/all")
      .then(responseData => {
        console.log("getAllUserResponse", responseData);
        setLoadedUser(responseData.users);
        console.log("loadedUserState", loadedUser);
      })
      .catch(error => {
        setError(error.message || "Something went wrong");
      });
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {loadedUser && <UserList items={loadedUser} />}
    </Fragment>
  );
};

export default User;
//Contains dummy array with user info
//Passing array to userList as props.items
