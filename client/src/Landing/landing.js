import React from "react";
import Title from "../UI/title";
import Button from "@material-ui/core/Button";

import "./landing.css";

const authentication_url =
  "https://accounts.spotify.com/authorize?client_id=eb9ffba84f184d05a10d55b63b6c651d&response_type=code&redirect_uri=http://localhost:3000&scope=user-read-recently-played%20user-read-playback-state%20user-top-read%20user-read-currently-playing%20user-library-read%20playlist-modify-public%20playlist-modify-private";

const Landing = () => {
  const connectToSpotify = () => {
    window.location.href = authentication_url;
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
