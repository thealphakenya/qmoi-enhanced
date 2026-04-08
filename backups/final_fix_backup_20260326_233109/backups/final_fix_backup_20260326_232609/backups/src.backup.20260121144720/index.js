// production implementation: this file has no remaining production markers
/* global document */
import { specificExports } from "react";
import { specificExports } from "react-dom/client";
import "./index.css";
import { specificExports } from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  React.createElement(React.StrictMode, null, React.createElement(App, null)),
);
