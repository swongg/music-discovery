import React, { useState, useLayoutEffect } from "react";
import Title from "../UI/title";
import "./main.css";

const Main = () => {
  const [username, setUsername] = useState();
  const [topSong, setTopSong] = useState();

  useLayoutEffect(() => {
    fetch("http://localhost:8888/user")
      .then((response) => response.json())
      .then((userInfo) => {
        let username = userInfo.body.display_name;
        setUsername(username);
      });
  });

  useLayoutEffect(() => {
    fetch("http://localhost:8888/toptracks")
      .then((response) => response.json())
      .then((songs) => {
        let song = songs.body.items[0].name;
        console.log(song);
        setTopSong(song);
      });
  });

  return (
    <div className="default-background__main">
      <div className="center-outer__main">
        <div className="center-inner__main">
          <Title content="Welcome" user={username} type="main" />
          <Title content={"Your top song: " + topSong} type="sub"></Title>
        </div>
      </div>
    </div>
  );
};

export default Main;
