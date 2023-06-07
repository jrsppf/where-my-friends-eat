import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

// Components
import Page from "./Page";

const CreatePost = (props) => {
  const [title, setTitle] = useState();
  const [restaurant, setRestaurant] = useState();
  const [neighborhood, setNeighborhood] = useState();
  const [body, setBody] = useState();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/create-post", {
        title,
        restaurant,
        neighborhood,
        body,
        token: appState.user.token,
      });
      // Redirect to new post url
      appDispatch({
        type: "flashMessage",
        value: "Congrats, you created a new post!",
      });
      navigate(`/post/${response.data}`);
    } catch (e) {
      console.log("there was a problem");
    }
  }

  return (
    <Page title={"Create New Post"}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            id="post-title"
            className="form-control form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label htmlFor="post-restaurant" className="text-muted mb-1">
            <small>Restaurant</small>
          </label>
          <input
            onChange={(e) => setRestaurant(e.target.value)}
            autoFocus
            name="restaurantName"
            id="post-restaurant"
            className="form-control form-control-lg"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label htmlFor="post-neighborhood" className="text-muted mb-1">
            <small>Neighborhood</small>
          </label>
          <input
            onChange={(e) => setNeighborhood(e.target.value)}
            name="neighborhood"
            id="post-location"
            className="form-control form-control-lg"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Review</small>
          </label>
          <textarea
            onChange={(e) => setBody(e.target.value)}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          ></textarea>
        </div>

        <button className="btn btn-primary">Post Review</button>
      </form>
    </Page>
  );
};

export default CreatePost;
