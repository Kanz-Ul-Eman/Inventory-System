import api from "../api/axios";

const getCategories = async (params) => {
  const { data } = await api.get("/categories", { params });
  return data;
};

const createCategory = async (data) => {
  const { data: response } = await api.post("/categories", data);
  return response;
};

const updateCategory = async (id, data) => {
  const { data: response } = await api.put(`/categories/${id}`, data);
  return response;
};

const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
