import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../../services/auth.service";

export const login = createAsyncThunk(
  "auth/login",

  async (credentials, thunkAPI) => {
    try {
      await loginUser(credentials);

      const user = await getCurrentUser();

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed.",
      );
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/currentUser",

  async (_, thunkAPI) => {
    try {
      return await getCurrentUser();
    } catch {
      return thunkAPI.rejectWithValue();
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",

  async (_, thunkAPI) => {
    try {
      return await logoutUser();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);
