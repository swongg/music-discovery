import React, { useState, useEffect } from "react";
import Title from "../UI/title";
import "./generatedList.css";
import Entity from "./entity";
import { Button, ButtonGroup } from "@material-ui/core/";
import { client, ip } from "../constants";
import SpotifyWebApi from "spotify-web-api-node";
import { initializeSpotifyApi } from "../initializeSpotifyAPI";

const url = new URL(window.location.href);
let option = url.searchParams.get("option");
let seeds_main = url.searchParams.get("seeds");
let nol = url.searchParams.get("nol");

const options = {
  TOPTRACKS_: 0,
  SAVEDTRACKS_: 1,
};

let createOptionArgForFetch = () => {
  let fetchOptionArg;
  switch (+option) {
    case options.TOPTRACKS_:
      fetchOptionArg = "toptracks";
      break;
    case options.SAVEDTRACKS_:
      fetchOptionArg = "savedtracks";
      break;
  }
  return fetchOptionArg;
};

let createRecommendationSeeds = (songs, option) => {
  console.log(songs);
  console.log("option:");
  console.log(option);
  let seeds = "";
  let songs_;
  if (option == options.TOPTRACKS_) {
    songs_ = songs.body.items;
  } else if (option == options.SAVEDTRACKS_) {
    songs_ = songs.body.items.map((t) => t.track);
  }
  for (let song of songs_) {
    seeds = seeds + "," + song.id;
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

  // const getRecommendationsNoSeeds = (spotifyApi) => {
  //   if (option == options.TOPTRACKS_) {
  //     console.log("line 62");
  //     spotifyApi.getMyTopTracks().then((topTracks) => {
  //       let seeds = createRecommendationSeeds(topTracks, option);
  //       setTimeout(() => {
  //         spotifyApi
  //           .getRecommendations({
  //             limit: nol,
  //             min_energy: 0.4,
  //             seed_tracks: seeds,
  //             min_popularity: 50,
  //           })
  //           .then((songs) => {
  //             let songs_ = songs.body.tracks;
  //             console.log("line 74");
  //             console.log(songs_);
  //             setDisplayList(songs_);
  //           });
  //       }, 1);
  //     });
  //   } else if (option == options.SAVEDTRACKS_) {
  //     spotifyApi.getMySavedTracks().then((savedTracks) => {
  //       let seeds = createRecommendationSeeds(savedTracks, option);
  //       setTimeout(() => {
  //         spotifyApi
  //           .getRecommendations({
  //             limit: nol,
  //             min_energy: 0.4,
  //             seed_tracks: seeds,
  //             min_popularity: 50,
  //           })
  //           .then((songs) => {
  //             let songs_ = songs.body.tracks;
  //             setDisplayList(songs_);
  //           });
  //       }, 1);
  //     });
  //   }
  // };

  const getRecommendationsNoSeeds = (spotifyApi) => {
  
    // if (option == options.TOPTRACKS_) {
      let songRetrieval = spotifyApi.getMyTopTracks();
    // } else if (option == options.SAVEDTRACKS_) {
    //   songRetrieval = spotifyApi.getMySavedTracks();
    //   console.log("line 110!");
    // }

    songRetrieval.then((savedTracks) => {
      console.log(savedTracks);
      let seeds = createRecommendationSeeds(savedTracks, option);
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

      if (!seeds_main) {
        console.log("line 140");
        getRecommendationsNoSeeds(spotifyApi);
      } else {
        setTimeout(() => {
          fetch(`${ip}/recommendations/?seeds=${seeds_main}&nol=${nol}`)
            .then((response) => response.json())
            .then((songs) => {
              let songs_ = songs.body.tracks;
              setDisplayList(songs_);
            });
        }, 1);
      }
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
