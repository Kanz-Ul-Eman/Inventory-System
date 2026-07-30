const orderService = require("../services/order.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const STATUS = require("../constants/statusCodes");
const MESSAGES = require("../constants/messages");

const createOrder = asyncHandler(async (req, res) => {

    const order = await orderService.createOrder(
        req.body,
        req.user.id
    );

    return ApiResponse.success(
        res,
        STATUS.CREATED,
        MESSAGES.ORDER_CREATED,
        {
            order,
        }
    );

});

const getAllOrders = asyncHandler(async (req, res) => {

    const result = await orderService.getAllOrders(req.query);

    return ApiResponse.success(

        res,

        STATUS.OK,

        "Orders fetched successfully.",

        result

    );

});

const getOrderById = asyncHandler(async (req, res) => {

    const order = await orderService.getOrderById(
        req.params.id
    );

    return ApiResponse.success(

        res,

        STATUS.OK,

        "Order fetched successfully.",

        {
            order,
        }

    );

});

const getOrdersByCustomer = asyncHandler(async (req, res) => {

    const orders =
        await orderService.getOrdersByCustomer(
            req.params.customerId
        );

    const message = result.orders.length != 0 
    ? "Orders fetched successfully."
    : "No matching orders found.";

    return ApiResponse.success(
        res,
        STATUS.OK,
        message,
        {
            orders,
        }
    );

});

const updateOrderStatus = asyncHandler(async (req, res) => {

    const order = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status
    );

    return ApiResponse.success(
        res,
        STATUS.OK,
        "Order status updated successfully.",
        { order }
    );

});

const cancelOrder = asyncHandler(async (req, res) => {

    const order = await orderService.cancelOrder(req.params.id);

    return ApiResponse.success(
        res,
        STATUS.OK,
        "Order cancelled successfully.",
        { order }
    );

});

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByCustomer,
    updateOrderStatus,
    cancelOrder
};