const express = require("express");

const router = express.Router();

const orderController = require("../controllers/order.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
    createOrderSchema,
    getOrdersQuerySchema,
    updateOrderStatusSchema,
} = require("../validators/order.validator");

router.post(
    "/",
    authenticate,
    authorize("ADMIN", "STAFF"),
    validate(createOrderSchema),
    orderController.createOrder
);

router.get(
    "/customer/:customerId",
    authenticate,
    authorize("ADMIN", "STAFF"),
    orderController.getOrdersByCustomer
);

router.get(
    "/",
    authenticate,
    authorize("ADMIN","STAFF"),
    validate(getOrdersQuerySchema, "query"),
    orderController.getAllOrders
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "STAFF"),
    orderController.getOrderById
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("ADMIN", "STAFF"),
    validate(updateOrderStatusSchema),
    orderController.updateOrderStatus
);

router.patch(
    "/:id/cancel",
    authenticate,
    authorize("ADMIN", "STAFF"),
    orderController.cancelOrder
);

module.exports = router;