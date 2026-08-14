import api from "../api/axios";

const getCustomers = async (params) => {
  const { data } = await api.get("/customers", { params });
  return data;
};

const createCustomer = async (payload) => {
  const { data } = await api.post("/customers", payload);
  return data;
};

const updateCustomer = async (id, payload) => {
  const { data } = await api.put(`/customers/${Number(id)}`, payload);
  return data;
};

const deleteCustomer = async (id) => {
  const { data } = await api.delete(`/customers/${Number(id)}`);
  return data;
};

export default {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
