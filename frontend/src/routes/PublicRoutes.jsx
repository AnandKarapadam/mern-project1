import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const { token, loading } = useSelector((state) => state.users);

  if (loading) return null;

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
export default PublicRoute