const express = require("express");

const productController = require("../controllers/product.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
    createProductSchema,
    updateProductSchema,
} = require("../validators/product.validator");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(createProductSchema),
    productController.createProduct
);

router.get(
    "/search",
    authenticate,
    authorize("ADMIN", "STAFF"),
    productController.searchProducts
);

router.get(
    "/low-stock",
    authenticate,
    authorize("ADMIN", "STAFF"),
    productController.getLowStockProducts
);

router.get(
    "/",
    authenticate,
    authorize("ADMIN", "STAFF"),
    productController.getAllProducts
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "STAFF"),
    productController.getProductById
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(updateProductSchema),
    productController.updateProduct
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    productController.deleteProduct
);

module.exports = router;