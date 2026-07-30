const categoryService = require("../services/category.service");
const ApiResponse = require("../utils/ApiResponse");
const STATUS = require("../constants/statusCodes");
const MESSAGES = require("../constants/messages");

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);

    return ApiResponse.success(res, STATUS.CREATED, MESSAGES.CATEGORY_CREATED, {
      category,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();

    return ApiResponse.success(res, STATUS.OK, MESSAGES.CATEGORIES_FETCHED, {
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    return ApiResponse.success(res, STATUS.OK, MESSAGES.CATEGORY_FETCHED, {
      category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );

    return ApiResponse.success(res, STATUS.OK, MESSAGES.CATEGORY_UPDATED, {
      category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);

    return ApiResponse.success(res, STATUS.OK, MESSAGES.CATEGORY_DELETED);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
