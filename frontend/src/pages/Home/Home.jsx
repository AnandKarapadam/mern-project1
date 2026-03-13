import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);

  const handleLogout = async () => {
    const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, logout"
  });

  if (result.isConfirmed) {

    dispatch(logout());

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      timer: 1200,
      showConfirmButton: false
    });

    navigate("/login");
  }
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