import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUserProfile = createAsyncThunk(
  "users/getUserProfile",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      localStorage.removeItem("token");  
      return rejectWithValue(data.message);
    }

    return data;
  }
);
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (formData, { rejectWithValue }) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue(data.message);
    }
    localStorage.setItem("token", data.token);
    return data;
  },
);
export const loginUser = createAsyncThunk(
  "users/loginUsers",
  async (userData, { rejectWithValue }) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data.message);
    }

    localStorage.setItem("token", data.token);
    return data;
  },
);
export const updateProfileImage = createAsyncThunk(
  "user/updateProfileImage",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/profile-image", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to update profile image");
      }

      return data.user; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const userSlice = createSlice({
  // [users,dispatch] = (reducers,{user:null,token:null,loading:false,error:null})
  name: "users",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        //login
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
        localStorage.removeItem("token");
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
