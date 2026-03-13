import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
  searchUsers,
} from "../../redux/adminSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";
import { adminLogout } from "../../redux/adminSlice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(searchUsers(value));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateCreate = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
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

  const validateEdit = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateCreate()) return;

    const result = await dispatch(createUser(form));
    if (createUser.rejected.match(result)) {
      setErrors({ email: result.payload });
      return;
    }
    setForm({ name: "", email: "", password: "" });
  };

  const handleUpdate = async () => {
    if (!validateEdit()) return;

    const result = await dispatch(updateUser({ id: editId, userData: form }));

    if (updateUser.rejected.match(result)) {
      setErrors({ email: result.payload });
      return;
    }
    setEditId(null);
  };

  const handleEdit = (user) => {
    setEditId(user._id);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
    });

    setErrors({});
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete) {
      dispatch(deleteUser(id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  const handleOpenCreate = () => {
    setForm({
      name: "",
      email: "",
      password: "",
    });

    setErrors({});
    setEditId(null);
  };
  const handleLogout = async () => {
    const confirmLogout = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (confirmLogout) {
      dispatch(adminLogout());
      Swal.fire({
        icon: "success",
        title: "Successfully logout!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <button className="btn btn-sm btn-danger my-3" onClick={handleLogout}>
        Logout
      </button>
      <input
        className="form-control mb-3"
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
      />

      <button
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
        onClick={handleOpenCreate}
      >
        Create User
      </button>
      <h3>Number of users:{users.length}</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th width="200">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users?.map((user) => (
            <tr key={user._id}>
              <td>
                <img
                  src={user.profileImage || ""}
                  alt="profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </td>

              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <button
                  className="btn btn-warning me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modal fade" id="createModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Create User</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <input
                className="form-control mb-1"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}

              <input
                className="form-control mb-1 mt-2"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}

              <input
                className="form-control mt-2"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-success" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Edit User</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <input
                className="form-control mb-1"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}

              <input
                className="form-control mb-1 mt-2"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}

              <input
                className="form-control mt-2"
                name="password"
                type="password"
                placeholder="New password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
