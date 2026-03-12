import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";


function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="homePage">
      <div className="homeCard">

        
        {user?.profileImage && (
          <div className="profileImageWrapper">
            <img
              src={user.profileImage}
              alt="Profile"
              className="profileImage"
            />
          </div>
        )}

        <h1 className="welcomeText">
          Welcome, <span>{user?.name}</span>
        </h1>

        <p className="subtitle">
          Manage your profile and explore your dashboard.
        </p>

        <div className="buttonGroup">

          <button
            className="btn profileBtn"
            onClick={() => navigate("/profile")}
          >
            Go To Profile
          </button>

          <button
            className="btn logoutBtn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Home;