import React from "react";
import { Link } from "react-router-dom";

// Components
import Page from "./Page";

const NotFound = () => {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Whoop, we can't find that page.</h2>
        <p className="lead text-muted">
          You can always visit the <Link to="/">homepage</Link> to get a fresh
          start.
        </p>
      </div>
    </Page>
  );
};

export default NotFound;