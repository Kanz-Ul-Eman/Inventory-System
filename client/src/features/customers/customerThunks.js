import { createAsyncThunk } from "@reduxjs/toolkit";

import customerService from "../../services/customer.service";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (params, thunkAPI) => {
    try {
      return await customerService.getCustomers(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch customers.",
      );
    }
  },
);

export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (payload, thunkAPI) => {
    try {
      return await customerService.createCustomer(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create customer.",
      );
    }
  },
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ id, payload }, thunkAPI) => {
    try {
      return await customerService.updateCustomer(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update customer.",
      );
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, thunkAPI) => {
    try {
      await customerService.deleteCustomer(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete customer.",
      );
    }
  },
);
