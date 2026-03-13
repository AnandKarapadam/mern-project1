import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/tokenUtils";

function PublicAdminRoute({ children }) {
  const { token } = useSelector((state) => state.admin);

  const storedToken = token || localStorage.getItem("adminToken");

  if (storedToken && isTokenValid(storedToken)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export default PublicAdminRoute;