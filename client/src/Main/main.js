import React, { useState, useEffect } from "react";
import Auth from "../Auth/auth";
import Title from "../UI/title";
import "./main.css";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "eb9ffba84f184d05a10d55b63b6c651d",
});

const Main = (props) => {
  const code = props.token;
  const access_token = Auth(code);

  const [username, setUsername] = useState();

  useEffect(() => {
    if (!access_token) return;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.getMe().then((res) => {
      setUsername(res.body.display_name);
      spotifyApi.getMyTopTracks().then((tracks) => {
        console.log("your top song: " + tracks.body.items[0].name);
      });
    });
  }, [access_token]);

  return (
    <div className="default-background__main">
      <div className="center-outer__main">
        <div className="center-inner__main">
          <Title content="Welcome" user={username} type="main" />
          <Title
            content="Neque porro quisquam est qui dolorem ipsum quia dolo sit amet,
        consectetur, adipsci velit"
            type="sub"
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
