import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authLogin as apiLogin, authRegister as apiRegister } from "@/api/auth";

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
export const register = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const data = await apiRegister({
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      password: formData.password,
    });
    return {
      user: data.data.user,
      token: data.data.ACCESS_TOKEN,
    };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message || "Đăng ký thất bại!");
  }
});

const initialState = {
  user: null,
  loading: false,
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
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;  
        state.token = action.payload.token; 
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
