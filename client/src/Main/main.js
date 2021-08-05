import React, { useState, useLayoutEffect, useEffect } from "react";
import Title from "../UI/title";
import "./main.css";
import { Paper, Tabs, Tab } from "@material-ui/core";

const Main = () => {
  const [username, setUsername] = useState();
  const [topSongs, setTopSongs] = useState();
  let [savedTracks, setSavedTracks] = useState();

  const [option, setOption] = useState(0);
  const [displayList, setDisplayList] = useState([]);

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
        //let song = songs.body.items[0].name;
        let songs_ = songs.body.items;
        setTopSongs(songs_);
        if (option == 0) setDisplayList(topSongs);
      });
  });

  useLayoutEffect(() => {
    fetch("http://localhost:8888/savedTracks")
      .then((response) => response.json())
      .then((songs) => {
        let songs_ = songs.body.items.map((t) => t.track);
        setSavedTracks(songs_);
      });
  });

  const handleChange = (event, newValue) => {
    setOption(newValue);
  };

  useEffect(() => {
    if (option === 0 && topSongs) {
      setDisplayList(topSongs);
    }
    if (option === 1 && savedTracks) {
      setDisplayList(savedTracks);
    }
  }, [option]);

  return (
    <div className="default-background__main">
      <div className="center-outer__main">
        <div className="center-inner__main">
          {username && <Title content="Welcome" user={username} type="main" />}
          <Paper square className="Tabs__main">
            <Tabs value={option} onChange={handleChange} centered>
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
