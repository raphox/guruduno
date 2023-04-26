import "regenerator-runtime/runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

window.addEventListener("contextmenu", (e) => e.preventDefault());

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
