import React, { useState, useEffect } from "react";
import { Card, Grid, Typography, Grow } from "@material-ui/core";
import AudioPlayer from "material-ui-audio-player";
import Heart from "react-animated-heart";
import SpotifyWebApi from "spotify-web-api-node";
import { initializeSpotifyApi } from "../initializeSpotifyAPI";

const Entity = (props) => {
  const [isClick, setClick] = useState();
  const item = props.item;

  const setLike = () => {
    setClick(!isClick);
  };

  useEffect(() => {
    let spotifyApi = new SpotifyWebApi();
    initializeSpotifyApi(spotifyApi);
    let idArr = [item.id];
    if (isClick) {
      spotifyApi.addToMySavedTracks(idArr).then(() => {
        console.log("successfully added");
      });
    }
    if (!isClick) {
      spotifyApi.removeFromMySavedTracks(idArr).then(() => {
        console.log("successfully removed");
      });
    }
  }, [isClick]);

  return (
    <Grow in={true} style={{ transformOrigin: "top" }} {...{ timeout: 1000 }}>
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
                  {item.preview_url ? (
                    <AudioPlayer
                      src={item.preview_url}
                      width="220px"
                      volume={false}
                    ></AudioPlayer>
                  ) : (
                    <div className="noDemo">demo currently not available</div>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
          <div className="likeButton__list">
            <Heart isClick={isClick} onClick={setLike} />
          </div>
        </Grid>
      </Card>
    </Grow>
  );
};

export default Entity;
