import React, { useState, useEffect } from "react";
import Title from "../UI/title";
import Track from "./track";
import "./main.css";
import { client } from "../constants";
import SpotifyWebApi from "spotify-web-api-node";

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
  localStorage.clear();
};

let spotifyApi;

const Main = () => {
  const [seedList, setSeedList] = useState([]);
  const [username, setUsername] = useState();
  const [topSongs, setTopSongs] = useState();
  const [savedTracks, setSavedTracks] = useState();
  const [numOfSongs, setNumOfSongs] = React.useState(5);

  const [option, setOption] = useState(options.TOPTRACKS_);
  const [displayList, setDisplayList] = useState([]);

  const updateSeedList = (seed) => {
    setSeedList(seed);
  };

  const handleNumOfSongsChange = (event) => {
    setNumOfSongs(event.target.value);
  };
  const initializeSpotifyApi = () => {
    spotifyApi = new SpotifyWebApi();
    let url = new URL(window.location.href);

    let access_token_from_url = url.searchParams.get("access_token");
    let access_token_from_storage = localStorage.getItem("access_token");
    console.log("check storage:");
    console.log(access_token_from_storage);

    if (access_token_from_url === null && access_token_from_storage === null)
      window.location.href = client;

    if (access_token_from_storage !== null) {
      spotifyApi.setAccessToken(access_token_from_storage);
    } else {
      localStorage.setItem("access_token", access_token_from_url);
      console.log("store item:")
      console.log("access_token_from_url")
      spotifyApi.setAccessToken(access_token_from_url);
    }
  };

  const storageContainsData = () => {
    return (
      "username" in localStorage &&
      "topTracks" in localStorage &&
      "savedTracks" in localStorage
    );
  };

  useEffect(() => {
    initializeSpotifyApi();

    if (storageContainsData()) {
      let username = localStorage.getItem("username");
      let topTracks = JSON.parse(localStorage.getItem("topTracks"));
      let savedTracks = JSON.parse(localStorage.getItem("savedTracks"));
      setUsername(username);
      setTopSongs(topTracks);
      setSavedTracks(savedTracks);
      setTimeout(() => setDisplayList(topTracks));
    } else {
      Promise.all([
        spotifyApi.getMe(),
        spotifyApi.getMyTopTracks({ limit: 36 }),
        spotifyApi.getMySavedTracks({ limit: 36 }),
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
      window.location.href = `${client}/generatelist/?option=${option}&nol=${numOfSongs}`;
    } else {
      window.location.href = `${client}/generatelist/?seeds=${seeds}&nol=${numOfSongs}`;
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
              Select up to 5 songs: currently {seedList.length} songs selected
            </span>

            <FormControl>
              <Select value={numOfSongs} onChange={handleNumOfSongsChange}>
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
