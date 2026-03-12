import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../redux/adminSlice";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminLogin() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, admin } = useSelector((state) => state.admin);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (admin) {
      navigate("/admin/dashboard");
    }
  }, [admin, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    dispatch(adminLogin(form));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">

      <div className="card p-4 shadow" style={{ width: "400px" }}>

        <h3 className="text-center mb-4">Admin Login</h3>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            className="form-control mb-1"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          {errors.email && (
            <small className="text-danger">{errors.email}</small>
          )}

          <input
            type="password"
            className="form-control mt-3 mb-1"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}

          <button
            className="btn btn-dark w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;
