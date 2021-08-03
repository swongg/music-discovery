import React from "react";
import Landing from "./Landing/landing";
import Main from "./Main/main";
import "./App.css";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return code ? <Main token={code} /> : <Landing />;
}

export default App;
