import { createAsyncThunk } from "@reduxjs/toolkit";

import productService from "../../services/product.service";

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (params, thunkAPI) => {
        try {
            return await productService.getProducts(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch products."
            );
        }
    }
);

export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (payload, thunkAPI) => {
        try {
            return await productService.createProduct(payload);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create product."
            );
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, payload }, thunkAPI) => {
        try {
            return await productService.updateProduct(id, payload);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update product."
            );
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id, thunkAPI) => {
        try {
            await productService.deleteProduct(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete product."
            );
        }
    }
);