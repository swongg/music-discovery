import React, { useState, useEffect } from "react";
import Title from "../UI/title";
import "./generatedList.css";
import Entity from "./entity";
import { Button, ButtonGroup } from "@material-ui/core/";
import { client } from "../constants";
import SpotifyWebApi from "spotify-web-api-node";
import { initializeSpotifyApi } from "../initializeSpotifyAPI";

const url = new URL(window.location.href);
const SEEDLIMIT = 5;
let option = url.searchParams.get("option");
let seeds_main = url.searchParams.get("seeds");
let nol = url.searchParams.get("nol");

const options = {
  TOPTRACKS_: 0,
  SAVEDTRACKS_: 1,
};

let createRecommendationSeeds = (songs, option) => {
  let seeds = "";
  let songs_;
  if (option == options.TOPTRACKS_) {
    songs_ = songs.body.items;
  } else if (option == options.SAVEDTRACKS_) {
    songs_ = songs.body.items.map((t) => t.track);
  }

  let limit = Math.min(SEEDLIMIT, songs_.length);

  for (let i = 0; i < limit; i++) {
    seeds = seeds + "," + songs_[i].id;
  }

  seeds = seeds.substring(1);
  return seeds;
};

const refreshPage = () => {
  window.location.reload();
};

const GeneratedList = () => {
  const [username, setUsername] = useState();
  const [displayList, setDisplayList] = useState([]);

  const goToMainPage = () => {
    window.location.href = `${client}/main`;
  };

  const getSongRecommendations = (spotifyApi) => {
    let songRetrieval;
    if (option == options.TOPTRACKS_) {
      songRetrieval = spotifyApi.getMyTopTracks();
    } else {
      songRetrieval = spotifyApi.getMySavedTracks();
    }

    songRetrieval.then((songs) => {
      let seeds = seeds_main;
      console.log(seeds);

      if (seeds === null) {
        seeds = createRecommendationSeeds(songs, option);
        console.log("created seeds:");
        console.log(seeds);
      }
      setTimeout(() => {
        spotifyApi
          .getRecommendations({
            limit: nol,
            min_energy: 0.4,
            seed_tracks: seeds,
            min_popularity: 50,
          })
          .then((songs) => {
            let songs_ = songs.body.tracks;
            console.log(songs_);
            setDisplayList(songs_);
          });
      }, 1);
    });
  };

  useEffect(() => {
    let spotifyApi = new SpotifyWebApi();
    initializeSpotifyApi(spotifyApi);

    spotifyApi.getMe().then((userInfo) => {
      let username = userInfo.body.display_name;
      setUsername(username);

      getSongRecommendations(spotifyApi);
    });
  }, []);

  const backgroundSize = {
    height: "150vh",
  };
  if (nol == 10) {
    backgroundSize.height = "230vh";
  }
  if (nol == 20) {
    backgroundSize.height = "450vh";
  }

  return (
    <div className="default-background__generatedlist">
      <div className="center-outer__generatedlist" style={backgroundSize}>
        <div className="center-inner__generatedlist">
          {username && (
            <Title content="Recommended List for" user={username} type="main" />
          )}
          <br></br>
          <ButtonGroup
            color="primary"
            aria-label="outlined primary button group"
          >
            <Button variant="contained" color="default" onClick={refreshPage}>
              Re-make
            </Button>
            <br></br>

            <Button variant="contained" color="default" onClick={goToMainPage}>
              Back
            </Button>
          </ButtonGroup>

          <br></br>

          {displayList && displayList.length > 0 && (
            <div className="recList">
              {displayList.map((item) => (
                <Entity item={item} key={item.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedList;
