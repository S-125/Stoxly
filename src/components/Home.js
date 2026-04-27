import React from "react";
import { Navigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <>
      <TopBar />
      {token ? <Dashboard /> : <Navigate to="/login" />}
    </>
  );
};

export default Home;