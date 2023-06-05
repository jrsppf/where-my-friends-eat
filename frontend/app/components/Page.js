import React, { useEffect } from "react";

// Components
import Container from "./Container";

const Page = (props) => {
  useEffect(() => {
    document.title = `${props.title} | WMFE`;
    window.scroll(0, 0);
  }, [props.title]);

  return <Container wide={props.wide}>{props.children}</Container>;
};

export default Page;
