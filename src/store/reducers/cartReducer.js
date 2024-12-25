import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { removeFromCart, getCart, updateCartItem } from "@/api/cart";

const initialState = {
  cart: null,
  status: 'idle',
  error: null
};

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ userId, productId, quantity, token }, { rejectWithValue }) => {
    try {
      const response = await updateCartItem(userId, productId, quantity, token);
      return {
        productId,
        quantity,
        ...response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update quantity");
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({userId, token}, { rejectWithValue }) => {
    try {
      const response = await getCart(userId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async ({userId, productId, token}, { rejectWithValue }) => {
    try {
      await removeFromCart(userId, productId, token);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove item");
    }
  }
);

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
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.cart?.cartItems) {
          state.cart.cartItems = state.cart.cartItems.filter(
            item => item.product.productId !== action.payload
          );
        }
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.cart?.cartItems) {
          const itemIndex = state.cart.cartItems.findIndex(
            item => item.productId === action.payload.productId
          );
          if (itemIndex !== -1) {
            state.cart.cartItems[itemIndex].quantity = action.payload.quantity;
          }
        }
      });
  }
});

export default cartSlice.reducer;
