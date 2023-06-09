import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

// Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";

import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("wheremyfriendseatToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("wheremyfriendseatToken"),
      username: localStorage.getItem("wheremyfriendseatUsername"),
      avatar: localStorage.getItem("wheremyfriendseatAvatar"),
    },
    isSearchOpen: false,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("wheremyfriendseatToken", state.user.token);
      localStorage.setItem("wheremyfriendseatUsername", state.user.username);
      localStorage.setItem("wheremyfriendseatAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("wheremyfriendseatToken");
      localStorage.removeItem("wheremyfriendseatUsername");
      localStorage.removeItem("wheremyfriendseatAvatar");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Routes>
            <Route
              path="/"
              element={state.loggedIn ? <Home /> : <HomeGuest />}
            />
            <Route path="/profile/:username/*" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <Search />
          </CSSTransition>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
