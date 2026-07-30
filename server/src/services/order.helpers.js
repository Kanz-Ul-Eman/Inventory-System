const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const validateCustomer = async (customerId) => {
  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      active: true,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError("Customer not found.", 404);
  }

  return customer;
};

const validateProducts = async (items) => {
  const productIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      active: true,
      isDeleted: false,
    },
  });

  if (products.length !== productIds.length) {
    throw new AppError("One or more products were not found.", 404);
  }

  return products;
};

const checkDuplicateProducts = (items) => {
  const ids = items.map((item) => item.productId);

  const uniqueIds = new Set(ids);

  if (ids.length !== uniqueIds.size) {
    throw new AppError("Duplicate products are not allowed.", 400);
  }
};

const calculateTotals = (items, products) => {
  let totalAmount = 0;

  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    if (item.quantity > product.quantityInStock) {
      throw new AppError(
        `${product.name} has insufficient stock. Available: ${product.quantityInStock}, Requested: ${item.quantity}.`,
        400,
      );
    }

    const unitPrice = Number(product.unitPrice);
    const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
    totalAmount += lineTotal;

    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.unitPrice,
      lineTotal,
    };
  });

  return {
    orderItems,
    totalAmount,
  };
};

const createOrderTransaction = async (
  customerId,
  createdById,
  orderItems,
  totalAmount,
) => {
  return await prisma.$transaction(
    async (tx) => {
      //Create Order
      const order = await tx.order.create({
        data: {
          customerId,
          createdById,
          totalAmount,
        },
      });

      //Create Order Items
      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
        })),
      });

      //Update Inventory
      for (const item of orderItems) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            quantityInStock: {
              gte: item.quantity,
            },
          },
          data: {
            quantityInStock: {
              decrement: item.quantity,
            },
          },
        });

        if (result.count === 0) {
          throw new AppError(
            `Insufficient stock for product ID ${item.productId}.`,
            400,
          );
        }
      }

      //Return Complete Order
      return await tx.order.findUnique({
        where: {
          id: order.id,
        },
        include: {
          customer: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
    },
    {
      timeout: 10000,
      maxWait: 5000,
    },
  );
};

const restoreStock = async (tx, orderItems) => {
    for (const item of orderItems) {
        await tx.product.update({
            where: {
                id: item.productId,
            },
            data: {
                quantityInStock: {
                    increment: item.quantity,
                },
            },
        });
    }
};

module.exports = {
  validateCustomer,
  validateProducts,
  checkDuplicateProducts,
  calculateTotals,
  createOrderTransaction,
  restoreStock
};


