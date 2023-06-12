import React, { useState, useContext } from "react";
import axios from "axios";
import DispatchContext from "../DispatchContext";


// Components
import Page from "./Page";

const HomeGuest = () => {
  const appDispatch = useContext(DispatchContext);


  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/register", {
        username,
        email,
        password,
      });
      if (response.data) {
        console.log("User was successfully created");
        appDispatch({ type: "login", data: response.data });
      } else {
        console.log("There was an error");
      }
    } catch (e) {
      console.log("There was an error");
    }
  }

  return (
    <Page title="Welcome" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Recommendations That Matter</h1>
          <p className="lead text-muted">
            Welcome to Where My Friends Eat, where eating out becomes a informed
            adventure powered by your friends! Tired of endlessly searching for
            the perfect restaurant to satisfy your cravings? Or have you ever
            been stuck in the eternal dilemma of "Where should we eat?"? Join
            our vibrant community of food enthusiasts, where you can
            effortlessly follow your friends and discover their expertly crafted
            restaurant reviews in your city. Whether you're a self-proclaimed
            foodie or simply seeking new culinary experiences, get ready to
            embark on a gastronomic journey like no other with Where My Friends
            Eat!
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
              />
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for Where My Friends Eat
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default HomeGuest;
