import api from "../api/axios";

const getOrders = async (params) => {
  const { data } = await api.get("/orders", { params });
  return data;
};

const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${Number(id)}`);
  return data;
};

const createOrder = async (payload) => {
  const { data } = await api.post("/orders", payload);
  return data;
};

const updateOrderStatus = async (id, payload) => {
  const { data } = await api.patch(`/orders/${Number(id)}/status`, payload);
  return data;
};

const cancelOrder = async (id) => {
  const { data } = await api.patch(`/orders/${Number(id)}/cancel`);
  return data;
};

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};
