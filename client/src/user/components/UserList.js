import React from "react";
import "./UserList.css";
//component
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

const UserList = ({ items }) => {
  if (items.length === 0) {
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
      {items.map((
        user //implicit return
      ) => (
        <UserItem
          key={user.id}
          Userid={user.id}
          name={user.name}
          image={user.image}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UserList;
//List i.e ul
//return ul,map it return result & pass to UserItem
