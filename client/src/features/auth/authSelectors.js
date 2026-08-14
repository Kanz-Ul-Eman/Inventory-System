export const selectUser = (state) => state.auth.user;

export const selectLoading = (state) => state.auth.loading;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectAuthError = (state) => state.auth.error;

export const selectInitialized = (state) => state.auth.initialized;
