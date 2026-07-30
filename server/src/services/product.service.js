const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const paginate = require("../utils/paginate");

const createProduct = async (data) => {
  const {
    name,
    sku,
    categoryId,
    unitPrice,
    quantityInStock,
    reorderLevel,
    active,
  } = data;

  // Check SKU
  const existingSku = await prisma.product.findUnique({
    where: {
      sku,
    },
  });

  if (existingSku) {
    throw new AppError("SKU already exists.", 409);
  }

  // Check Category
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      categoryId,
      unitPrice,
      quantityInStock,
      reorderLevel,
      active: active ?? true,
    },
    include: {
      category: true,
    },
  });

  return product;
};

const getAllProducts = async (query = {}) => {
  const { page, limit, skip } = paginate(query);

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.product.count({
      where: {
        isDeleted: false,
      },
    }),
  ]);

  return {
    products,
    pagination: {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      perPage: limit,
    },
  };
};

const getProductById = async (id) => {
  const productId = Number(id);

  if (isNaN(productId)) {
    throw new AppError("Invalid product ID.", 400);
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isDeleted: false,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  return product;
};

const updateProduct = async (id, data) => {
  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
      isDeleted: false,
    },
  });

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new AppError("Category not found.", 404);
    }
  }

  return await prisma.product.update({
    where: {
      id: Number(id),
    },
    data,
    include: {
      category: true,
    },
  });
};

const deleteProduct = async (id) => {
  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
      isDeleted: false,
    },
  });

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  await prisma.product.update({
    where: {
      id: Number(id),
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return;
};

const searchProducts = async (keyword) => {
  return prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        {
          name: {
            contains: keyword,
          },
        },
        {
          sku: {
            contains: keyword,
          },
        },
      ],
    },
    include: {
      category: true,
    },
  });
};

const getLowStockProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      category: true,
    },
  });

  return products.filter(
    (product) => product.quantityInStock <= product.reorderLevel,
  );
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
