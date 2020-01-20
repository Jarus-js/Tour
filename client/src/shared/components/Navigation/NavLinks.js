import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth-Context";
import Button from "../FormElements/Button";
import "./NavLinks.css";
const NavLinks = props => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      {auth.isLoggedIn ? (
        <>
          <li>
            <NavLink to="/u1/places">MY PLACES</NavLink>
          </li>
          <li>
            <NavLink to="/places/new">ADD PLACE</NavLink>
          </li>
          <li>
            <Button onClick={auth.logout}>LOGOUT</Button>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/" exact>
              ALL USERS
            </NavLink>
          </li>
          <li>
            <NavLink to="/login">AUTHENTICATE</NavLink>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavLinks;
