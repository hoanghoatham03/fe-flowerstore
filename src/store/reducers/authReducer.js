import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authLogin as apiLogin } from "@/api/auth";

export const login = createAsyncThunk("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const data = await apiLogin(formData.email, formData.password);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = "idle";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
