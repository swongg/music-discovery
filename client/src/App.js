import React from "react";
import Landing from "./Landing/landing";
import Main from "./Main/main";
import GeneratedList from "./GeneratedList/generatedList";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/main" component={Main} />
          <Route path="/generatedList" component={GeneratedList} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
