import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authLogin as apiLogin } from "@/api/auth";

export const login = createAsyncThunk("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const data = await apiLogin(formData.email, formData.password);
    return {
      user: data.data.user,
      token: data.data.ACCESS_TOKEN,
    };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || "Đăng nhập thất bại!");
  }
});

const initialState = {
  user: null,
  loading: "idle",
  token: null, 
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = "idle";
        state.user = action.payload.user;  
        state.token = action.payload.token; 
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
