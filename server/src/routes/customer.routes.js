const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
    createCustomerSchema,
    updateCustomerSchema
} = require("../validators/customer.validator");

router.post(
    "/",
    authenticate,
    authorize("ADMIN", "STAFF"),
    validate(createCustomerSchema),
    customerController.createCustomer
);

router.get(
    "/",
    authenticate,
    authorize("ADMIN", "STAFF"),
    customerController.getAllCustomers
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "STAFF"),
    customerController.getCustomerById
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN", "STAFF"),
    validate(updateCustomerSchema),
    customerController.updateCustomer
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    customerController.deleteCustomer
);

module.exports = router;