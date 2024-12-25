import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { removeFromCart ,getCart, updateCartItem } from "@/api/cart";  

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({userId, token}, { rejectWithValue }) => {
    try {
      const response = await getCart(userId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ userId, productId, token }, { rejectWithValue }) => {
    try {
      const response  = await removeFromCart(userId, productId, token);
      console.log(response);
      return response ;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi không xác định");
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ userId, productId, quantity, token }, { rejectWithValue }) => {
    try {
      const updatedCart = await updateCartItem(userId, productId, quantity, token);
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi không xác định");
    }
  }
);
const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        state.items = action.payload.cartItems;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.items = action.payload.cartItems;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeCartItem.fulfilled, (state) => {
        state.status = "succeeded";
  
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export default cartSlice.reducer;
