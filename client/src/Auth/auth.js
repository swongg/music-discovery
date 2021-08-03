import { useState, useEffect } from "react";
import axios from "axios";

const Auth = (code) => {
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        //window.location = "/";
      });
  }, [code]);

  return accessToken;
};

export default Auth;
