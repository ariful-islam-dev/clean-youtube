import { StoreProvider } from "easy-peasy";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Layout from "./components/UI/Layout";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <App /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StoreProvider value="store">
    <RouterProvider router={router} />
  </StoreProvider>
);
