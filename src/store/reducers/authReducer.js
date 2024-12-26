import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authLogin as apiLogin, authRegister as apiRegister } from "@/api/auth";
import { updateProfile, getProfile } from "../../api/profile";

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

export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async ({ userId, formData, token }, { rejectWithValue }) => {
    try {
      await updateProfile(userId, formData, token);
      const response = await getProfile(userId, token);
      return response.data.avatar;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Could not update avatar");
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  token: null, 
  error: null,
  loadingAvatar: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
    setUserProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
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
      })
      .addCase(updateAvatar.pending, (state) => {
        state.loadingAvatar = true;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loadingAvatar = false;
        if (state.user) {
          state.user.avatar = action.payload;
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loadingAvatar = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUserProfile } = authSlice.actions;

export default authSlice.reducer;
