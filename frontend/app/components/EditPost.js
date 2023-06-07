import React, { useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

// Components
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import NotFound from "./NotFound";

const EditPost = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    restaurant: {
      value: "",
      hasErrors: false,
      message: "",
    },
    neighborhood: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.restaurant.value = action.value.restaurant;
        draft.neighborhood.value = action.value.neighborhood;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        return;
      case "restaurantChange":
        draft.restaurant.hasErrors = false;
        draft.restaurant.value = action.value;
        return;
      case "neighborhoodChange":
        draft.neighborhood.hasErrors = false;
        draft.neighborhood.value = action.value;
        return;
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        return;
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "Title cannot be empty.";
          return;
        }
      case "restaurantRules":
        if (!action.value.trim()) {
          draft.restaurant.hasErrors = true;
          draft.restaurant.message = "Restaurant cannot be empty.";
          return;
        }
      case "neighborhoodRules":
        if (!action.value.trim()) {
          draft.neighborhood.hasErrors = true;
          draft.neighborhood.message = "Neighborhood cannot be empty.";
          return;
        }
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "Body cannot be empty.";
          return;
        }
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, originalState);

  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "restaurantRules", value: state.restaurant.value });
    dispatch({ type: "neighborhoodRules", value: state.neighborhood.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  }

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await axios.get(`/post/${state.id}`, {
          CancelToken: request.token,
        });
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
          if (appState.user.username != response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You don't have permission to edit that post.",
            });
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (e) {
        console.log("there was a problem");
      }
    }
    fetchPost();
    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const request = axios.CancelToken.source();

      async function fetchPost() {
        try {
          const response = await axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              restaurant: state.restaurant.value,
              neighborhood: state.neighborhood.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              CancelToken: request.token,
            }
          );
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Post was updated." });
        } catch (e) {
          console.log("there was a problem");
        }
      }
      fetchPost();
      return () => {
        request.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching) {
    return (
      <Page title={"..."}>
        <LoadingDotsIcon />
      </Page>
    );
  }

  return (
    <Page title={"Edit Post"}>
      <Link to={`/post/${state.id}`} className="small font-weight-bold">
        &laquo; Back
      </Link>
      <form onSubmit={submitHandler} className="mt-3">
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onBlur={(e) =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            value={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="post-restaurant" className="text-muted mb-1">
            <small>Restaurant</small>
          </label>
          <input
            onBlur={(e) =>
              dispatch({ type: "restaurantRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "restaurantChange", value: e.target.value })
            }
            name="restaurant"
            id="post-location"
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
            onBlur={(e) =>
              dispatch({ type: "neighborhoodRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "neighborhoodChange", value: e.target.value })
            }
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
            onBlur={(e) =>
              dispatch({ type: "bodyRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
            value={state.body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
};

export default EditPost;
