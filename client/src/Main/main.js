import React, { useState, useEffect } from "react";
import Title from "../UI/title";
import "./main.css";
import { Paper, Tabs, Tab } from "@material-ui/core";

const options = {
  TOPTRACKS_: 0,
  SAVEDTRACKS_: 1,
};

const Main = () => {
  const [username, setUsername] = useState();
  const [topSongs, setTopSongs] = useState();
  let [savedTracks, setSavedTracks] = useState();
  let serverUri = "http://localhost:8888/";

  const [option, setOption] = useState(options.TOPTRACKS_);
  const [displayList, setDisplayList] = useState([]);

  useEffect(() => {
    console.log("in useEffect");

    if (
      "users" in localStorage &&
      "toptracks" in localStorage &&
      "savedtracks" in localStorage
    ) {
      let username = localStorage.getItem("username");
      setUsername(username);
      let topTracks = JSON.parse(localStorage.getItem("topTracks"));
      setTopSongs(topTracks);
      let savedTracks = JSON.parse(localStorage.getItem("savedTracks"));
      setSavedTracks(savedTracks);

    } else {
      Promise.all([
        fetch(serverUri + "user").then((res) => res.json()),
        fetch(serverUri + "toptracks").then((res) => res.json()),
        fetch(serverUri + "savedtracks").then((res) => res.json()),
      ])
        .then(([userInfo, topTracksInfo, savedTracksInfo]) => {
          let username = userInfo.body.display_name;
          setUsername(username);
          localStorage.setItem("username", username);
          let topTracks = topTracksInfo.body.items;
          localStorage.setItem("topTracks", JSON.stringify(topTracks));
          setTopSongs(topTracks);
          let savedTracks = savedTracksInfo.body.items.map((t) => t.track);
          console.log(savedTracks);
          localStorage.setItem("savedTracks", JSON.stringify(savedTracks));
          setSavedTracks(savedTracks);
        })
        .then(() => {
          if (option === options.TOPTRACKS_ && topSongs) {
            setDisplayList(topSongs);
          } else if (option === options.SAVEDTRACKS_ && savedTracks) {
            setDisplayList(savedTracks);
          }
        });
    }
  }, [option]);

  const optionChange = (event, newOption) => {
    setOption(newOption);
  };

  return (
    <div className="default-background__main">
      <div className="center-outer__main">
        <div className="center-inner__main">
          {username && <Title content="Welcome" user={username} type="main" />}
          <Paper square className="Tabs__main">
            <Tabs value={option} onChange={optionChange} centered>
              <Tab label="Most Played Songs" />
              <Tab label="Liked Songs" />
            </Tabs>
          </Paper>
          {displayList && displayList.length > 0 && (
            <div>
              {displayList.map((item) => (
                <div key={item.id}>{item.name}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
