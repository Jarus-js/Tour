import React from "react";
import { Link } from "react-router-dom";
import "./UserItem.css";
import Avatar from "../../shared/components/UIElements/Avatar";
const UserItem = ({ Userid, name, image, placeCount }) => {
  return (
    <li className="user-item">
      <div className="user-item__content">
        <Link to={`/${Userid}/places`}>
          <div className="user-item__image">
            <Avatar image={image} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {placeCount}
              {placeCount === 1 ? "place" : "places"}
            </h3>
          </div>
        </Link>
      </div>
    </li>
  );
};

export default UserItem;
//return li
//What u want to display on screen
