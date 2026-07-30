const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const paginate = require("../utils/paginate");

const {
  validateCustomer,
  validateProducts,
  checkDuplicateProducts,
  calculateTotals,
  createOrderTransaction,
  restoreStock,
} = require("./order.helpers");

const createOrder = async (data, userId) => {
  //Validate Customer
  await validateCustomer(data.customerId);

  //Duplicate Products
  checkDuplicateProducts(data.items);

  //Validate Products
  const products = await validateProducts(data.items);

  //Calculate Totals
  const { orderItems, totalAmount } = calculateTotals(data.items, products);

  //Transaction
  return await createOrderTransaction(
    data.customerId,
    userId,
    orderItems,
    totalAmount,
  );
};

const getAllOrders = async (query) => {
  const { page, limit, skip } = paginate(query);

  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.customerId) {
    where.customerId = Number(query.customerId);
  }

  if (query.keyword) {
    where.customer = {
      name: {
        contains: query.keyword,
      },
    };
  }

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },

      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },

        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },

        orderItems: {
          select: {
            quantity: true,
            unitPrice: true,
            lineTotal: true,

            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    }),

    prisma.order.count({
      where,
    }),
  ]);

  return {
    orders,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getOrderById = async (id) => {
  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
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

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  return order;
};

const getOrdersByCustomer = async (customerId) => {
  const orders = await prisma.order.findMany({
    where: {
      customerId: Number(customerId),
    },

    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

const updateOrderStatus = async (id, newStatus) => {
  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!order) {
    throw new AppError("Order not found.", 404);
  }
  if (order.status === "CANCELLED") {
    throw new AppError("Cancelled orders cannot be updated.", 400);
  }
  if (order.status === "SHIPPED") {
    throw new AppError("Shipped orders cannot be updated.", 400);
  }
  const validTransitions = {
    PENDING: ["CONFIRMED"],
    CONFIRMED: ["SHIPPED"],
  };
  if (!validTransitions[order.status]?.includes(newStatus)) {
    throw new AppError(
      `Cannot change status from ${order.status} to ${newStatus}.`,
      400,
    );
  }
  return prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      status: newStatus,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

const cancelOrder = async (id) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        orderItems: true,

        customer: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    if (order.status === "CANCELLED") {
      throw new AppError("Order is already cancelled.", 400);
    }

    if (order.status === "SHIPPED") {
      throw new AppError("Shipped orders cannot be cancelled.", 400);
    }

    await restoreStock(tx, order.orderItems);

    const cancelledOrder = await tx.order.update({
      where: {
        id: order.id,
      },

      data: {
        status: "CANCELLED",

        cancelledAt: new Date(),
      },

      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },

        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    return cancelledOrder;
  });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  updateOrderStatus,
  cancelOrder,
};
