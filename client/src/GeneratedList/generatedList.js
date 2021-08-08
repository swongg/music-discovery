import React, { useState, useLayoutEffect, useEffect } from "react";
import Title from "../UI/title";
import AudioPlayer from "material-ui-audio-player";
import "./generatedList.css";
import { Card, Grid, Typography, Grow } from "@material-ui/core";

const GeneratedList = () => {
  const [username, setUsername] = useState();
  const [displayList, setDisplayList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8888/user")
      .then((response) => response.json())
      .then((userInfo) => {
        let username = userInfo.body.display_name;
        setUsername(username);
      });
  }, []);

  // this is so nast
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
          {displayList && displayList.length > 0 && (
            <div className="recList">
              {displayList.map((item) => (
                <Grow
                  key={item.id}
                  in={true}
                  style={{ transformOrigin: "top" }}
                  {...{ timeout: 1000 }}
                >
                  <Card direction="column">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm container>
                        <Grid item xs={3}>
                          <img src={item.album.images[0].url} />
                        </Grid>
                        <Grid item xs={9}>
                          <div className="information__list">
                            <div className="songTexts__list">
                              <Typography className="songName__list">
                                {item.name}
                              </Typography>
                              <Typography
                                className="artistName__list"
                                color="textSecondary"
                              >
                                {item.artists.map((artist) => (
                                  <span key={artist.id}>{artist.name} </span>
                                ))}
                              </Typography>
                            </div>
                            <div className="audioPlayer">
                              <AudioPlayer
                                src={item.preview_url}
                                width="220px"
                                volume={false}
                              ></AudioPlayer>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                </Grow>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedList;
