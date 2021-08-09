import React, { useState, useLayoutEffect, useEffect } from "react";
import Title from "../UI/title";
import "./generatedList.css";
import Entity from "./entity";
import { Button, ButtonGroup } from "@material-ui/core/";

const refreshPage = () => {
  window.location.reload();
};

const GeneratedList = () => {
  const [username, setUsername] = useState();
  const [displayList, setDisplayList] = useState([]);

  const goToMainPage = () => {
    window.location.href = "./main";
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
    fetch("http://localhost:8888/savedTracks/?num=5")
      .then((response) => response.json())
      .then((songs) => {
        let seeds = "";
        let songs_ = songs.body.items.map((t) => t.track);
        for (let s of songs_) {
          seeds = seeds + "," + s.id;
        }
        seeds = seeds.substring(1);
        setTimeout(() => {
          fetch(`http://localhost:8888/recommendations/?seeds=${seeds}`)
            .then((response) => response.json())
            .then((songs) => {
              let songs_ = songs.body.tracks;
              setDisplayList(songs_);
            });
        }, 1);
      });
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
