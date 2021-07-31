const express = require("express");
const app = express();
// const fqdn = window.location.host;
const fqdn = "localhost:8888";
const dotenv = require("dotenv");
const querystring = require("querystring");

dotenv.config();

const port = process.env.PORT;
const client_id = process.env.CLIENT_ID;
console.log(client_id);

let client_secret = process.env.CLIENT_SECRET;
const redirect_uri = fqdn + "/callback/";
console.log(redirect_uri);
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

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
