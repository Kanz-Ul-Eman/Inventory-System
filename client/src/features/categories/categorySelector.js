export const selectCategories = (state) => state.categories.categories;

export const selectCategoriesLoading = (state) => state.categories.loading;

export const selectCategoriesPagination = (state) =>
  state.categories.pagination;
