import React, { useState, useEffect, useMemo } from "react";
import Title from "../UI/title";
import "./main.css";
import { Grid, Tooltip } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

const Track = (props) => {
  let [isSelected, setSelected] = useState(false);

  const useHover = () => {
    const [hovered, setHovered] = useState();

    const eventHandlers = useMemo(
      () => ({
        onMouseOver() {
          myAudio = new Audio(item.preview_url);
          myAudio.volume = 0.2;

          myAudio.play().catch((err) => {});
          setHovered(true);
        },
        onMouseOut() {
          myAudio.pause();
          myAudio.currentTime = 0;
          setHovered(false);
        },
      }),
      []
    );

    return [hovered, eventHandlers];
  };

  const item = props.item;

  let myAudio = new Audio();
  const [hovered, eventHandlers] = useHover();

  const selectSong = () => {
    setSelected(!isSelected);
    setTimeout(() => {
      myAudio.pause();
    }, 1000);
  };

  return (
    <Grid item xs={2} onClick={selectSong}>
      <div className="toolTipContainer__main">
        <Tooltip title={item.name + " - " + item.artists[0].name} arrow zoom>
          <div className="img-overlay-wrap">
            <img
              className={
                "albumPhoto" + (isSelected ? " color" : " blacknwhite")
              }
              src={item.album.images[0].url}
              {...eventHandlers}
            />
            {isSelected && <CheckIcon />}
          </div>
        </Tooltip>
      </div>
    </Grid>
  );
};

export default Track;
