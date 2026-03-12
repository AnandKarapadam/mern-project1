import React, { useEffect } from "react";
import Login from "./pages/Login/Login";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import PublicRoute from "./routes/PublicRoutes";
import { useDispatch } from "react-redux";
import { getUserProfile } from "./redux/userSlice";
import { isTokenValid } from "./utils/tokenUtils";
import { useNavigate } from "react-router-dom";
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!isTokenValid(adminToken) && adminToken) {
      localStorage.removeItem("adminToken");
      navigate("/admin/login", { replace: true });
    }

    const userToken = localStorage.getItem("token");
    if (!isTokenValid(userToken) && userToken) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }

    if (isTokenValid(userToken)) {
      dispatch(getUserProfile());
    }
  }, [dispatch, navigate]);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedUserRoute>
              <Home />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedUserRoute>
              <Profile />
            </ProtectedUserRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
       } />
      </Routes>
    </>
  );
}

export default App;
