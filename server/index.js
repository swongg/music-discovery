const express = require("express");
// const fqdn = window.location.host;
const dotenv = require("dotenv");
const querystring = require("querystring");
const SpotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const app = express();
app.use(cors());

dotenv.config();

const port = process.env.PORT || 80;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const client_uri = process.env.CLIENT_URI;
let userLoggedIn = false;

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

app.get("/loginstatus", (req, res) => {
  res.send(userLoggedIn);
});

app.get("/auth", (req, res) => {
  let state = generateRandomString(16);
  let scopes = [
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read user-read-currently-playing",
    "user-library-read playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private",
    "user-library-modify",
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
    userLoggedIn = true;
    spotifyApi
      .authorizationCodeGrant(code)
      .then((data) => {
        let access_token = data.body["access_token"];
        let refresh_token = data.body["refresh_token"];
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
          res.redirect(`${client_uri}/main?access_token=${access_token}`);
        
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/toptracks", (req, res) => {
  let num = 36;
  if (req.query.num) num = req.query.num;
  spotifyApi
    .getMyTopTracks({
      limit: num,
    })
    .then((topTracks) => {
      res.json(topTracks);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/savedtracks", (req, res) => {
  let num = 36;
  if (req.query.num) num = req.query.num;
  spotifyApi
    .getMySavedTracks({
      limit: num,
    })
    .then((savedTracks) => {
      res.json(savedTracks);
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

app.get("/recommendations", (req, res) => {
  let seeds = req.query.seeds.split(",");
  let nol = req.query.nol;
  spotifyApi
    .getRecommendations({
      limit: nol,
      min_energy: 0.4,
      seed_tracks: seeds,
      min_popularity: 50,
    })
    .then((recommendations) => {
      res.json(recommendations);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/savetrack", (req, res) => {
  let param = [];
  let id = req.query.id.toString();
  param.push(id);
  let obj = { ids: param };
  spotifyApi
    .addToMySavedTracks(obj.ids)
    .then(function (data) {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/removetrack", (req, res) => {
  let param = [];
  let id = req.query.id.toString();
  param.push(id);
  let obj = { ids: param };
  spotifyApi
    .removeFromMySavedTracks(obj.ids)
    .then(function (data) {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});