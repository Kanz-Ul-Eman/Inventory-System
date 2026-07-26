const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/category.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
    createCategorySchema,
    updateCategorySchema,
} = require("../validators/category.validator");

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(createCategorySchema),
    categoryController.createCategory
);

router.get(
    "/",
    authenticate,
    authorize("ADMIN", "STAFF"),
    categoryController.getAllCategories
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "STAFF"),
    categoryController.getCategoryById
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(updateCategorySchema),
    categoryController.updateCategory
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    categoryController.deleteCategory
);

module.exports = router;