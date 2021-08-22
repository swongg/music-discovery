import { client } from "./constants";

export const initializeSpotifyApi = (spotifyApi) => {
  let url = new URL(window.location.href);

  let access_token_from_url = url.searchParams.get("access_token");
  let access_token_from_storage = sessionStorage.getItem("access_token");
  console.log("check storage:");
  console.log(access_token_from_storage);

  if (access_token_from_url === null && access_token_from_storage === null)
    window.location.href = client;

  if (access_token_from_storage !== null) {
    spotifyApi.setAccessToken(access_token_from_storage);
  } else {
    sessionStorage.setItem("access_token", access_token_from_url);
    console.log("store item:");
    console.log("access_token_from_url");
    spotifyApi.setAccessToken(access_token_from_url);
  }
};
