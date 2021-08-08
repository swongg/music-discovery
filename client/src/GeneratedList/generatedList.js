import React, { useState, useLayoutEffect, useEffect } from "react";
import Title from "../UI/title";
import AudioPlayer from "material-ui-audio-player";
import "./generatedList.css";
import { Card, Grid, Typography } from "@material-ui/core";

const GeneratedList = () => {
  const [username, setUsername] = useState();
  let [savedTracks, setSavedTracks] = useState();
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
    fetch("http://localhost:8888/savedTracks")
      .then((response) => response.json())
      .then((songs) => {
        let songs_ = songs.body.items.map((t) => t.track);
        setSavedTracks(songs_);
        setDisplayList(songs_);
      });
  });

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
                <Card direction="column" key={item.id}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm container>
                      {/* part on the left */}
                      <Grid item xs={3}>
                        <img src={item.album.images[0].url} />
                      </Grid>
                      {/* part on the right */}
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
                          {/* music player from material-ui-audio-player*/}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedList;
