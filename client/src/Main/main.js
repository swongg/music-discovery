import React, { useState, useEffect } from "react";
import Title from "../UI/title";
import Track from "./track";
import "./main.css";

import {
  Paper,
  Tabs,
  Tab,
  Grid,
  Button,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from "@material-ui/core";


const options = {
  TOPTRACKS_: 0,
  SAVEDTRACKS_: 1,
};

window.onunload = function () {
  sessionStorage.clear();
};

const Main = () => {
  const [seedList, setSeedList] = useState([]);
  const [username, setUsername] = useState();
  const [topSongs, setTopSongs] = useState();
  let [savedTracks, setSavedTracks] = useState();
  let serverUri = "http://localhost:8888/";
  let clientUri = "http://localhost:3000/";
  const [num, setNum] = React.useState(5);

  const [option, setOption] = useState(options.TOPTRACKS_);
  const [displayList, setDisplayList] = useState([]);

  const updateSeedList = (seed) => {
    setSeedList(seed);
  };

  const handleNumChange = (event) => {
    setNum(event.target.value);
  };

  useEffect(() => {}, [seedList]);

  useEffect(() => {
    if (
      "username" in sessionStorage &&
      "topTracks" in sessionStorage &&
      "savedTracks" in sessionStorage
    ) {
      let username = sessionStorage.getItem("username");
      let topTracks = JSON.parse(sessionStorage.getItem("topTracks"));
      let savedTracks = JSON.parse(sessionStorage.getItem("savedTracks"));
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
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("topTracks", JSON.stringify(topTracks));
        sessionStorage.setItem("savedTracks", JSON.stringify(savedTracks));
        setTimeout(() => setDisplayList(topTracks));
      });
    }
  }, []);

  useEffect(() => {
    if (option === options.TOPTRACKS_ && topSongs) {
      setDisplayList(topSongs);
    } else if (option === options.SAVEDTRACKS_ && savedTracks) {
      setDisplayList(savedTracks);
    }
  }, [option]);

  const optionChange = (event, newOption) => {
    setOption(newOption);
  };

  const generateSongs = (seeds, option) => {
    if (!seeds) {
      window.location.href =
        clientUri + "generatelist" + "/?option=" + option + "&nol=" + num;
    } else {
      window.location.href =
        clientUri + "generatelist" + "/?seeds=" + seeds + "&nol=" + num;
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

            <FormControl>
              <Select value={num} onChange={handleNumChange}>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
              <FormHelperText>Number of tracks to generate</FormHelperText>
            </FormControl>
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
