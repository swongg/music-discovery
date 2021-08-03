import React, { Fragment } from "react";
import "./title.css";
const Title = (props) => {
  if (props.type === "main")
    return (
      <Fragment>
        <div className="title">
          {props.content} {props.user}
        </div>
      </Fragment>
    );
  else if (props.type === "sub")
    return (
      <Fragment>
        <div className="sub-title">{props.content}</div>
      </Fragment>
    );
};

export default Title;
