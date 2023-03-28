import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import Navbar from "./Navbar/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
