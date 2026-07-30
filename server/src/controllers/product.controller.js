const productService = require("../services/product.service");
const ApiResponse = require("../utils/ApiResponse");
const STATUS = require("../constants/statusCodes");
const MESSAGES = require("../constants/messages");

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    return ApiResponse.success(res, STATUS.CREATED, MESSAGES.PRODUCT_CREATED, {
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts(req.query);

    return ApiResponse.success(
      res,
      STATUS.OK,
      MESSAGES.PRODUCTS_FETCHED,
      result,
    );
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    return ApiResponse.success(res, STATUS.OK, MESSAGES.PRODUCT_FETCHED, {
      product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    return ApiResponse.success(res, STATUS.OK, MESSAGES.PRODUCT_UPDATED, {
      product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);

    return ApiResponse.success(res, STATUS.OK, MESSAGES.PRODUCT_DELETED);
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const products = await productService.searchProducts(req.query.keyword);

    return ApiResponse.success(res, STATUS.OK, MESSAGES.PRODUCTS_SEARCHED, {
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await productService.getLowStockProducts();

    return ApiResponse.success(
      res,
      STATUS.OK,
      MESSAGES.LOW_STOCK_PRODUCTS_FETCHED,
      {
        products,
      },
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getLowStockProducts,
};
