import React from "react";
import UserList from "../components/UserList";

const User = () => {
  const USERS = [
    {
      user_id: "u1",
      name: "Jarus",
      places: 1,
      image:
        "https://scontent.fktm8-1.fna.fbcdn.net/v/t1.0-9/78950153_1714169562052257_5290771419381104640_n.jpg?_nc_cat=105&_nc_ohc=52tvYcaabN0AQkJOk4Uhg5KYOx-NTZ50Yy_E3Hg6qL--jOz8OlZoX80HA&_nc_ht=scontent.fktm8-1.fna&oh=f0bc213fd9a700538d0490cef1b988e9&oe=5EA5ADFB"
    }
  ];
  return <UserList items={USERS} />;
};

export default User;
//Contains dummy array with user info
//Passing array to userList as props.items
