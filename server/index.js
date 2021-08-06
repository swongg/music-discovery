const express = require("express");
// const fqdn = window.location.host;
const dotenv = require("dotenv");
const querystring = require("querystring");
const SpotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const app = express();
app.use(cors());

dotenv.config();

const port = process.env.PORT;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get("/auth", (req, res) => {
  let state = generateRandomString(16);
  let scopes = [
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read user-read-currently-playing",
    "user-library-read playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
  ];

  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.

  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});

app.get("/callback", (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;

  if (state === null || code === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    spotifyApi
      .authorizationCodeGrant(code)
      .then((data) => {
        let access_token = data.body["access_token"];
        let refresh_token = data.body["refresh_token"];
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        res.redirect("http://localhost:3000/main");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/toptracks", (req, res) => {
  spotifyApi
    .getMyTopTracks()
    .then((tracks) => {
      res.json(tracks);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/savedtracks", (req, res) => {
  spotifyApi
    .getMySavedTracks()
    .then((lists) => {
      res.json(lists);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/playlists", (req, res) => {
  spotifyApi
    .getUserPlaylists()
    .then((lists) => {
      res.json(lists);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user", (req, res) => {
  spotifyApi
    .getMe()
    .then((userProfile) => {
      res.json(userProfile);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
