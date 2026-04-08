// [production READY] this file has no remaining production markers
/* global document */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  React.createElement(React.StrictMode, null, React.createElement(App, null)),
);
