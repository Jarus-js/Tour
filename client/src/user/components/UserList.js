import React from "react";
import "./UserList.css";
//component
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

const UserList = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h1>No User Found</h1>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((
        user //implicit return
      ) => (
        <UserItem
          key={user.user_id}
          Userid={user.user_id}
          name={user.name}
          image={user.image}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UserList;
//List i.e ul
//return ul,map it return result & pass to UserItem
