import { createSlice } from "@reduxjs/toolkit";

import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productThunks";

const initialState = {
  products: [],
  pagination: {},
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.error = null;
        state.products.unshift(action.payload.product);
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.error = null;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.product.id,
        );

        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.error = null;
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
