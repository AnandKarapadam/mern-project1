import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (adminData, thunkAPI) => {
    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    const data = await res.json();

    if (!res.ok) {
      return thunkAPI.rejectWithValue(data.message);
    }

    localStorage.setItem("adminToken", data.token);
    return data;
  },
);

export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().admin.token|| localStorage.getItem("adminToken");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }

    const res = await fetch("http://localhost:5000/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    return data;
  },
);
export const searchUsers = createAsyncThunk(
  "admin/searchUsers",
  async (query, thunkAPI) => {
    const token = thunkAPI.getState().admin.token || localStorage.getItem("adminToken");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }

    const res = await fetch(
      `http://localhost:5000/api/admin/users?search=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();

    return data;
  },
);
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, userData }, thunkAPI) => {
    const token =  thunkAPI.getState().admin.token || localStorage.getItem("adminToken");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }

    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    return data;
  },
);
export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData, thunkAPI) => {
    const token = thunkAPI.getState().admin.token || localStorage.getItem("adminToken");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }

    const res = await fetch("http://localhost:5000/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    return data;
  },
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().admin.token || localStorage.getItem("adminToken");

    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }

    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem('token');
    return id;
  },
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: JSON.parse(localStorage.getItem("admin")) || null,
    token: localStorage.getItem("adminToken") || null,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u,
        );
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const { adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
