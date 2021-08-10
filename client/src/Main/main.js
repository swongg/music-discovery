import React, { useState, useEffect } from "react";
import Title from "../UI/title";
import Track from "./track";
import "./main.css";
import { Paper, Tabs, Tab, Grid, Button } from "@material-ui/core";

const options = {
  TOPTRACKS_: 0,
  SAVEDTRACKS_: 1,
};

const Main = () => {
  const [seedList, setSeedList] = useState([]);
  const [username, setUsername] = useState();
  const [topSongs, setTopSongs] = useState();
  let [savedTracks, setSavedTracks] = useState();
  let serverUri = "http://localhost:8888/";
  let clientUri = "http://localhost:3000/";

  const [option, setOption] = useState(options.TOPTRACKS_);
  const [displayList, setDisplayList] = useState([]);

  const updateSeedList = (seed) => {
    console.log(seed);
    setSeedList(seed);
  };

  useEffect(() => {}, [seedList]);

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

  const generateSongs = (seeds, option) => {
    if (!seeds) {
      window.location.href = clientUri + "generatelist" + "/?option=" + option;
    } else {
      window.location.href = clientUri + "generatelist" + "/?seeds=" + seeds;
    }
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

          <div className="text__main">
            <span className="title">
              You've currently selected {seedList.length} songs
            </span>
            <Button
              className="button-center-round__main"
              variant="contained"
              onClick={() => generateSongs(seedList, option)}
            >
              Generate
            </Button>
          </div>

          {displayList && displayList.length > 0 && (
            <div className="library__main">
              <Grid container spacing={1}>
                <Grid item xs={12} sm container>
                  {displayList.map((item) => (
                    <Track
                      key={item.id}
                      item={item}
                      seedList={seedList}
                      triggerParentUpdate={updateSeedList}
                    ></Track>
                  ))}
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
