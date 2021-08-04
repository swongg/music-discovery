import React from "react";
import Title from "../UI/title";
import Button from "@material-ui/core/Button";

import "./landing.css";


const Landing = () => {
  const connectToSpotify = () => {
    window.location.href = "http://localhost:8888/auth"
  };

  return (
    <div className="default-background__landing">
      <div className="center-outer__landing">
        <div className="center-inner__landing">
          <Title content="Music Discovery" type="main" />
          <Title
            content="Neque po????rro quisquam est qui dolorem ipsum quia dolo sit amet,
        consectetur, adipsci velit"
            type="sub"
          />
          <Button
            className="button-center-round"
            variant="contained"
            color="default"
            onClick={connectToSpotify}
          >
            Authorize Spotify
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
