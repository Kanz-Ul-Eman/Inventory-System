const customerService = require("../services/customer.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const STATUS = require("../constants/statusCodes");
const MESSAGES = require("../constants/messages");

const createCustomer = asyncHandler(async (req, res) => {
    const customer = await customerService.createCustomer(req.body);

    return ApiResponse.success(
        res,
        STATUS.CREATED,
        MESSAGES.CUSTOMER_CREATED,
        {
            customer,
        }
    );
});

const getAllCustomers = asyncHandler(async (req, res) => {
    const result = await customerService.getAllCustomers(req.query);

    return ApiResponse.success(
        res,
        STATUS.OK,
        "Customers fetched successfully.",
        result
    );
});

const getCustomerById = asyncHandler(async (req, res) => {
    const customer = await customerService.getCustomerById(req.params.id);

    return ApiResponse.success(
        res,
        STATUS.OK,
        "Customer fetched successfully.",
        { customer }
    );
});

const updateCustomer = asyncHandler(async (req, res) => {
    const customer = await customerService.updateCustomer(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        STATUS.OK,
        MESSAGES.CUSTOMER_UPDATED,
        {
            customer,
        }
    );
});

const deleteCustomer = asyncHandler(async (req, res) => {
    await customerService.deleteCustomer(req.params.id);

    return ApiResponse.success(
        res,
        STATUS.OK,
        MESSAGES.CUSTOMER_DELETED
    );
});

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};
/*

*/