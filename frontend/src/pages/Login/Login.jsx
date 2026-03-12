import React, { useEffect, useState } from "react";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.users);
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: "" });
  }

  function validate() {
    let newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    if (isLogin) {
      try {
        const data = await dispatch(
          loginUser({
            email: formData.email,
            password: formData.password,
          }),
        ).unwrap();

        if (data.user.isAdmin) {
          Swal.fire({
            icon: "warning",
            title: "Access Denied",
            text: "Admin users cannot log in from this page.",
          });
          localStorage.removeItem("token");
          return;
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err || "Something went wrong",
        });
      }
    } else {
      dispatch(registerUser(formData));
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <h2 className="authTitle fw-bold">{isLogin ? "LOGIN" : "REGISTER"}</h2>

        <form className="authForm" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                name="name"
                className="form-control authInput"
                type="text"
                placeholder="Full Name"
                onChange={handleChange}
                value={formData.name}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </>
          )}

          <input
            name="email"
            className="form-control authInput"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.email}
          />
          {errors.email && (
            <small className="text-danger">{errors.email}</small>
          )}

          <input
            name="password"
            className="form-control authInput"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
          />
          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}

          <button
            className="btn btn-primary authButton w-100"
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>

        <p className="authSwitch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <span className="authToggle" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
