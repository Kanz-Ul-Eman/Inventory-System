import { createSlice } from "@reduxjs/toolkit";

import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "./customerThunks";

const initialState = {
  customers: [],
  pagination: {},
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers || [];
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.error = null;
        state.customers.unshift(action.payload.customer);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.error = null;
        const index = state.customers.findIndex(
          (customer) => customer.id === action.payload.customer.id,
        );

        if (index !== -1) {
          state.customers[index] = action.payload.customer;
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.error = null;
        state.customers = state.customers.filter(
          (customer) => customer.id !== Number(action.payload),
        );
      });
  },
});

export default customerSlice.reducer;
