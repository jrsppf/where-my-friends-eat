import React from "react";
import { Link } from "react-router-dom";

const User = (props) => {
  const user = props.user;

  return (
    <Link
      onClick={props.onClick}
      to={`/profile/${user.username}`}
      className="list-group-item list-group-item-action"
    >
      {/* <img className="avatar-tiny" src={post.author.avatar} />{" "} */}
      <strong>{user.username}</strong>{" "}
    </Link>
  );
};

export default Post;
