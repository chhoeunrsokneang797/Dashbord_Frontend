import React from "react";
import { Outlet } from "react-router-dom";

const MainLayoutLogin = () => {
  return (
    <div>
      <div></div>
      <div className="body">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayoutLogin;
