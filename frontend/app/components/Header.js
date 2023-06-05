import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";

// Components
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";

const Header = (props) => {
  const appState = useContext(StateContext);

  return (
    <header className="header-bar mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h5 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            Where My Friends Eat
          </Link>
        </h5>
        {appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  );
};

export default Header;
