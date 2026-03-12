import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { updateProfileImage } from "../../redux/userSlice";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [errors, setErrors] = useState({});

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {

    if (!validate()) return;

    // check if anything changed
    const isNameChanged = name !== user?.name;
    const isEmailChanged = email !== user?.email;
    const isImageChanged = image !== null;

    if (!isNameChanged && !isEmailChanged && !isImageChanged) {
      alert("No changes detected");
      return;
    }

    const formData = new FormData();

    if (isNameChanged) formData.append("name", name);
    if (isEmailChanged) formData.append("email", email);
    if (isImageChanged) formData.append("image", image);

    try {
      setLoading(true);

      await dispatch(updateProfileImage(formData)).unwrap();

      alert("Profile updated successfully!");

      navigate("/");

    } catch (err) {
      alert("Failed to update profile: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profilePage">
      <div className="profileCard">
        <h2 className="profileTitle">User Profile</h2>

        
        <div className="imageWrapper">
          <img
            src={preview || user?.profileImage || "/avatar.png"}
            alt="profile"
            className="profileImage"
          />
        </div>

       
        <input
          type="text"
          className="form-control mt-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        {errors.name && (
          <small className="text-danger">{errors.name}</small>
        )}

       
        <input
          type="email"
          className="form-control mt-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        {errors.email && (
          <small className="text-danger">{errors.email}</small>
        )}

        
        <input
          type="file"
          className="form-control mt-3"
          onChange={handleUpload}
        />

       
        <button
          className="btn btn-primary w-100 mt-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </button>

      </div>
    </div>
  );
}