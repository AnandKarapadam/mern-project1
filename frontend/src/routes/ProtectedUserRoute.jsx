import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedUserRoute({ children }) {
  const { token, user, loading } = useSelector((state) => state.users);


  if (loading) return null; 

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedUserRoute;