import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../components/axiosInstance";

// Utility functions
const saveToLocalStorage = (key, value) => {
  console.log(value)
  if (value && (key==="user")) localStorage.setItem(key, JSON.stringify(value));
  else localStorage.setItem(key, value);
};

const loadFromLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  console.log(value)
  if (value && (key === "access_token" || key === "refresh_token")) return value;
  return value ? JSON.parse(value) : null;
};

const clearLocalStorage = () => {
  // localStorage.removeItem("user");
  // localStorage.removeItem("access_token");
  // localStorage.removeItem("refresh_token");
  localStorage.clear();
};

// Async thunks
export const login = createAsyncThunk("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/login/", { username, password });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Login failed" });
  }
});

export const signup = createAsyncThunk("auth/signup", async ({ username, email, password, role }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/signup/", { username, email, password, role });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Signup failed" });
  }
});

export const refreshAccessToken = createAsyncThunk("auth/refreshAccessToken", async (_, { getState, rejectWithValue }) => {
  try {
    const refreshToken = getState().auth.token.refresh;
    if (!refreshToken) return rejectWithValue({ message: "No refresh token available" });

    const response = await axiosInstance.post("/auth/refresh/", { refresh: refreshToken });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Token refresh failed" });
  }
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadFromLocalStorage("user"),
    token: {
      access: loadFromLocalStorage("access_token"),
      refresh: loadFromLocalStorage("refresh_token"),
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = { access: null, refresh: null };
      clearLocalStorage();
      delete axiosInstance.defaults.headers["Authorization"];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = {
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
        state.error = null;

        saveToLocalStorage("user", action.payload.user);
        saveToLocalStorage("access_token", action.payload.access);
        saveToLocalStorage("refresh_token", action.payload.refresh);

        axiosInstance.defaults.headers["Authorization"] = `Bearer ${action.payload.access}`;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Login failed" };
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = {
          access: action.payload.tokens.access,
          refresh: action.payload.tokens.refresh,
        };
        state.error = null;

        saveToLocalStorage("user", action.payload.user);
        saveToLocalStorage("access_token", action.payload.tokens.access);
        saveToLocalStorage("refresh_token", action.payload.tokens.refresh);

        axiosInstance.defaults.headers["Authorization"] = `Bearer ${action.payload.tokens.access}`;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Signup failed" };
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token.access = action.payload.access;

        saveToLocalStorage("access_token", action.payload.access);

        axiosInstance.defaults.headers["Authorization"] = `Bearer ${action.payload.access}`;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || { message: "Token refresh failed" };

        // state.user = null;
        // state.token = { access: null, refresh: null };
        // clearLocalStorage();
        delete axiosInstance.defaults.headers["Authorization"];

      });
  },
});

// Actions
export const { logout } = authSlice.actions;

// Reducer
export default authSlice.reducer;
