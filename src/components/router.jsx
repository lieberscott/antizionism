import * as React from "react";
import { Switch, Route, Router } from "wouter";

import MainPage from "../pages/singleExample/MainPage.jsx";
import SubmitPage from "../pages/submitPage/SubmitPage.jsx";

/**
* The router is imported in app.jsx
*
* Our site just has two routes in it–Home and About
* Each one is defined as a component in /pages
* We use Switch to only render one route at a time https://github.com/molefrog/wouter#switch-
*/

export default () => (
  <Switch>
    <Route path="/submit" component={ SubmitPage } />
    <Route path="/" component={MainPage} />
    {/* <Route path="/test" component={Test} /> */}
  </Switch>
);
