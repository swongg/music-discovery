import React, { useState, useEffect } from "react";
import Title from "../UI/title";
import "./generatedList.css";
import Entity from "./entity";
import { Button, ButtonGroup } from "@material-ui/core/";

const url = new URL(window.location.href);
let option = url.searchParams.get("option");
let seeds_main = url.searchParams.get("seeds");

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
  let seeds = "";
  let songs_;
  if (option == "toptracks") {
    songs_ = songs.body.items;
  } else if (option == "savedtracks") {
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
    window.location.href = "http://localhost:3000/main";
  };

  useEffect(() => {
    fetch("http://localhost:8888/user")
      .then((response) => response.json())
      .then((userInfo) => {
        let username = userInfo.body.display_name;
        setUsername(username);
      });
  }, []);

  useEffect(() => {
    if (!seeds_main) {
      let fetchOptionArg = createOptionArgForFetch();

      fetch("http://localhost:8888/" + fetchOptionArg + "/?num=5")
        .then((response) => response.json())
        .then((songs) => {
          let seeds = createRecommendationSeeds(songs, fetchOptionArg);

          setTimeout(() => {
            fetch(`http://localhost:8888/recommendations/?seeds=${seeds}`)
              .then((response) => response.json())
              .then((songs) => {
                let songs_ = songs.body.tracks;
                setDisplayList(songs_);
                console.log(songs_);
              });
          }, 1);
        });
    } else {
      setTimeout(() => {
        fetch(`http://localhost:8888/recommendations/?seeds=${seeds_main}`)
          .then((response) => response.json())
          .then((songs) => {
            let songs_ = songs.body.tracks;
            setDisplayList(songs_);
          });
      }, 1);
    }
  }, []);

  return (
    <div className="default-background__generatedlist">
      <div className="center-outer__generatedlist">
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
