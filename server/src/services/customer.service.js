const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const paginate = require("../utils/paginate");

const createCustomer = async (data) => {
  const existingEmail = await prisma.customer.findFirst({
    where: {
      email: data.email,
      isDeleted: false,
    },
  });

  if (existingEmail) {
    throw new AppError("Email already exists.", 409);
  }

  const existingPhone = await prisma.customer.findFirst({
    where: {
      phone: data.phone,
      isDeleted: false,
    },
  });

  if (existingPhone) {
    throw new AppError("Phone number already exists.", 409);
  }

  try {
    return await prisma.customer.create({
      data: {
        ...data,
        active: true,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      const target = error.meta?.target || [];

      if (target.includes("Customer_email_key")) {
        throw new AppError("Email already exists.", 409);
      }

      if (target.includes("Customer_phone_key")) {
        throw new AppError("Phone number already exists.", 409);
      }
    }

    throw error;
  }
};

const getAllCustomers = async (query) => {
  const { page, limit, skip } = paginate(query);

  const keyword = query.keyword?.trim() || "";

  const where = {
    isDeleted: false,
  };

  if (keyword) {
    where.OR = [
      {
        name: {
          contains: keyword,
        },
      },
      {
        email: {
          contains: keyword,
        },
      },
      {
        phone: {
          contains: keyword,
        },
      },
    ];
  }

  const [customers, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.customer.count({
      where,
    }),
  ]);

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCustomerById = async (id) => {
  const numericId = Number(id);
  if (!id || isNaN(numericId)) {
    throw new AppError("Invalid or missing Customer ID.", 400);
  }
  const customer = await prisma.customer.findFirst({
    where: {
      id: Number(id),
      isDeleted: false,
    },
    include: {
      orders: true,
    },
  });

  if (!customer) {
    throw new AppError("Customer not found.", 404);
  }

  return customer;
};

const updateCustomer = async (id, data) => {
  const numericId = Number(id);
  if (!id || isNaN(numericId)) {
    throw new AppError("Invalid or missing Customer ID.", 400);
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id: numericId,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError("Customer not found.", 404);
  }

  if (data.email) {
    const existingEmail = await prisma.customer.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: numericId,
        },
        isDeleted: false,
      },
    });

    if (existingEmail) {
      throw new AppError("Email already exists.", 409);
    }
  }

  if (data.phone) {
    const existingPhone = await prisma.customer.findFirst({
      where: {
        phone: data.phone,
        NOT: {
          id: numericId,
        },
        isDeleted: false,
      },
    });

    if (existingPhone) {
      throw new AppError("Phone already exists.", 409);
    }
  }

  try {
    return await prisma.customer.update({
      where: {
        id: numericId,
      },
      data,
    });
  } catch (error) {
    if (error.code === "P2002") {
      const target = error.meta?.target || [];

      if (target.includes("Customer_email_key")) {
        throw new AppError("Email already exists.", 409);
      }

      if (target.includes("Customer_phone_key")) {
        throw new AppError("Phone already exists.", 409);
      }
    }

    throw error;
  }
};

const deleteCustomer = async (id) => {
  const numericId = Number(id);
  if (!id || isNaN(numericId)) {
    throw new AppError("Invalid or missing Customer ID.", 400);
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id: numericId,
      isDeleted: false,
    },
    include: {
      orders: true,
    },
  });

  if (!customer) {
    throw new AppError("Customer not found.", 404);
  }

  if (customer.orders.length > 0) {
    throw new AppError("Customer cannot be deleted because orders exist.", 400);
  }

  await prisma.customer.update({
    where: {
      id: numericId,
    },
    data: {
      active: false,
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return;
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
