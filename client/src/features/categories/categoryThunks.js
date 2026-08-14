import { createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "../../services/category.service";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (params, thunkAPI) => {
    try {
      const data = await categoryService.getCategories(params);

      return data.categories || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories.",
      );
    }
  },
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (payload, thunkAPI) => {
    try {
      const data = await categoryService.createCategory(payload);

      return data.category;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create category.",
      );
    }
  },
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, payload }, thunkAPI) => {
    try {
      const data = await categoryService.updateCategory(id, payload);

      return data.category;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update category.",
      );
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, thunkAPI) => {
    try {
      await categoryService.deleteCategory(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete category.",
      );
    }
  },
);
