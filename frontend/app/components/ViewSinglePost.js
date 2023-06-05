import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Components
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";

const ViewSinglePost = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await axios.get(`/post/${id}`, {
          CancelToken: request.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("there was a problem");
      }
    }
    fetchPost();
    return () => {
      request.cancel();
    };
  }, []);

  if (isLoading) {
    return (
      <Page title={"..."}>
        <LoadingDotsIcon />
      </Page>
    );
  }

  const postDate = new Date(post.createdDate);
  const postDateFormatted = `${
    postDate.getMonth() + 1
  }/${postDate.getDate()}/${postDate.getFullYear()}`;

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {postDateFormatted}
      </p>

      <div className="body-content">
        <p>{post.title}</p>
        <p>{post.body}</p>
      </div>
    </Page>
  );
};

export default ViewSinglePost;
