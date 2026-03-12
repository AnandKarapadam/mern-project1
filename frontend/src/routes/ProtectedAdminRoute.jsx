import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { adminLogout } from "../redux/adminSlice";
import { isTokenValid } from "../utils/tokenUtils";

function ProtectedAdminRoute({ children }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.admin);

  const storedToken = token || localStorage.getItem("adminToken");

  if (!storedToken) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isTokenValid(storedToken)) {
    dispatch(adminLogout());
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;