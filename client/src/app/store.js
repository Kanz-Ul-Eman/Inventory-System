import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/categories/categorySlice";
import customerReducer from "../features/customers/customerSlice";
import productReducer from "../features/products/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    customers: customerReducer,
    products: productReducer,
  },
});
