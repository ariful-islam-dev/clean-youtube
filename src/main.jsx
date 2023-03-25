import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: "",
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StoreProvider value="store">
    <App />
  </StoreProvider>
);
