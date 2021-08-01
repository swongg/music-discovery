const express = require("express");
const app = express();
// const fqdn = window.location.host;
const fqdn = "http://localhost:3000";
const dotenv = require("dotenv");
const axios = require("axios");
const querystring = require("querystring");

dotenv.config();

const port = process.env.PORT;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = fqdn + "/callback/";

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
  let scope =
    "user-read-recently-played user-top-read user-read-currently-playing user-library-read playlist-modify-public playlist-modify-private";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
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

    axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'post',
      params: {
        grant_type: 'client_credentials',
        code: code,
        redirect_uri: redirect_uri
      },
      headers: {
        'Accept':'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        username: client_id,
        password: client_secret
      }
    }).then((body) => {
      let token = body.data.access_token;
      console.log(token);
    }).catch((err) => {
      console.log(err);
    })
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
