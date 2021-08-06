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
    if (
      "username" in localStorage &&
      "topTracks" in localStorage &&
      "savedTracks" in localStorage
    ) {
      let username = localStorage.getItem("username");
      let topTracks = JSON.parse(localStorage.getItem("topTracks"));
      let savedTracks = JSON.parse(localStorage.getItem("savedTracks"));
      setUsername(username);
      setTopSongs(topTracks);
      setSavedTracks(savedTracks);
      setTimeout(() => setDisplayList(topTracks));
    } else {
      Promise.all([
        fetch(serverUri + "user").then((res) => res.json()),
        fetch(serverUri + "toptracks").then((res) => res.json()),
        fetch(serverUri + "savedtracks").then((res) => res.json()),
      ]).then(([userInfo, topTracksInfo, savedTracksInfo]) => {
        let username = userInfo.body.display_name;
        let topTracks = topTracksInfo.body.items;
        let savedTracks = savedTracksInfo.body.items.map((t) => t.track);
        setUsername(username);
        setTopSongs(topTracks);
        setSavedTracks(savedTracks);
        localStorage.setItem("username", username);
        localStorage.setItem("topTracks", JSON.stringify(topTracks));
        localStorage.setItem("savedTracks", JSON.stringify(savedTracks));
      });
    }
  }, []);

  useEffect(() => {
    if (option === options.TOPTRACKS_ && topSongs) {
      setDisplayList(topSongs);
    } else if (option === options.SAVEDTRACKS_ && savedTracks) {
      setDisplayList(savedTracks);
    }
    console.log(displayList);
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
          <br></br> <br></br>
          {displayList && displayList.length > 0 && (
            <div>
              {displayList.map((item) => (
                // <div key={item.id}>{item.name}</div>
                <div key={item.id}>
                  <img className="albumPhoto" src={item.album.images[0].url} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
