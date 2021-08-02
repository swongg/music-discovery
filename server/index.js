const express = require("express");
const app = express();
// const fqdn = window.location.host;
const fqdn = "http://localhost:3000";
const dotenv = require("dotenv");
const querystring = require("querystring");
const SpotifyWebApi = require("spotify-web-api-node");

dotenv.config();

const port = process.env.PORT;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = fqdn + "/callback/";

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
  ];

  // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.

  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});

app.get("/callback", (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;

  if (state === null) {
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
        spotifyApi.getMyTopTracks().then((tracks) => {
          console.log("your top song: " + tracks.body.items[0].name);
          res.redirect("/me/");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/topartists", (req, res) => {
  console.log("now we're at top artists end point");
  spotifyApi.getMyTopArtists().then((artists) => {
    console.log("your top artist: " + artists.body.items[0].name);
    res.send(artists.body.items);
  });
});

app.get("/me", (req, res) => {
  console.log("now we're at the me end point");
  spotifyApi.getMe().then((userProfile) => {
    console.log(userProfile.body.display_name);
    res.send(userProfile.body);
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
