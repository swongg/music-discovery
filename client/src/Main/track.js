import React, { useState, useMemo, useEffect } from "react";
import "./main.css";
import { Grid, Tooltip, Modal, Backdrop, Fade } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

const Track = (props) => {
  let [isSelected, setSelected] = useState();
  const [open, setOpen] = React.useState(false);

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
  };

  useEffect(() => {
    let seedList = props.seedList;

    if (isSelected == true && !seedList.includes(item.id)) {
      seedList.push(item.id);
      seedList = seedList.filter((element) => element !== "");
    }
    if (isSelected == false) {
      seedList = seedList.filter((element) => element !== item.id);
    }
    if (seedList.includes(item.id)) {
      setSelected(true);
    }
    props.triggerParentUpdate(seedList);
  }, [isSelected]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid item xs={2}>
      <Grid
        onClick={
          props.seedList.length >= 5 && isSelected != true
            ? handleOpen
            : selectSong
        }
      >
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="modal__track"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="paper__track">
            <h5 id="transition-modal-title">Oops</h5>
            <p id="transition-modal-description">
              You have already selected 5 songs.
            </p>
          </div>
        </Fade>
      </Modal>
    </Grid>
  );
};

export default Track;
