import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

// Components
import LoadingDotsIcon from "./LoadingDotsIcon";

const ProfilePosts = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/posts`, {
          CancelToken: request.token,
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("there was a problem");
      }
    }
    fetchPosts();
    return () => {
      request.cancel();
    };
  }, []);

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className="list-group">
      {posts.map((post) => {
        const postDate = new Date(post.createdDate);
        const postDateFormatted = `${
          postDate.getMonth() + 1
        }/${postDate.getDate()}/${postDate.getFullYear()}`;
        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.author.avatar} />{" "}
            <strong>{post.title}</strong>{" "}
            <span className="text-muted small">on {postDateFormatted} </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProfilePosts;
