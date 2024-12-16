import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authLogin } from "../api";


export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  const response = await authLogin(user);
  return response.data;
});

const initialState = {
  isLoggedIn: false,
  loading: "idle",
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.loading = "idle";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = "loading";
        state.error = "";
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true;
        state.loading = "idle";
        state.error = "";
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
