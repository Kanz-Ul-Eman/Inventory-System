import api from "../api/axios";

const getProducts = async (params) => {
  const keyword = params?.keyword?.trim();

  if (keyword) {
    const { data } = await api.get("/products/search", {
      params: {
        keyword,
      },
    });

    const products = data.products || [];

    return {
      products,
      pagination: {
        totalProducts: products.length,
        totalPages: 1,
        currentPage: 1,
        perPage: products.length,
      },
    };
  }

  const { data } = await api.get("/products", {
    params,
  });

  return data;
};

const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);

  return data;
};

const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);

  return data;
};

const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);

  return data;
};

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
