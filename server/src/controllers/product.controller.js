const productService = require("../services/product.service");

const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product,
        });
    } catch (error) {
        next(error);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const result = await productService.getAllProducts(page, limit);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product,
        });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

const searchProducts = async (req, res, next) => {
    try {
        const products = await productService.searchProducts(req.query.keyword);

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        next(error);
    }
};

const getLowStockProducts = async (req, res, next) => {
    try {
        const products = await productService.getLowStockProducts();

        return res.status(200).json({
            success: true,
            products,
        });
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