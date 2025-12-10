import * as React from "react";
import { Switch, Route, Router } from "wouter";

import Test from "../pages/singleExample/Test.jsx";
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
    <Route path="/" component={MainPage} />
    {/* <Route path="/test" component={Test} /> */}
    <Route path="/submit" component={ SubmitPage } />
  </Switch>
);
