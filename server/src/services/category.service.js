const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const createCategory = async (data) => {
    const { name, description, active } = data;

    const existingCategory = await prisma.category.findFirst({
        where: {
            name,
            isDeleted: false,
        },
    });

    if (existingCategory) {
        throw new AppError("Category already exists.", 409);
    }

    const category = await prisma.category.create({
        data: {
            name,
            description,
            active: active ?? true,
        },
    });

    return category;
};

const getAllCategories = async () => {
    return await prisma.category.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

const getCategoryById = async (id) => {
    const categoryId = Number(id);

    if (isNaN(categoryId)) {
        throw new AppError("Invalid category ID.", 400);
    }

    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            isDeleted: false,
        },
        include: {
            products: true,
        },
    });

    if (!category) {
        throw new AppError("Category not found.", 404);
    }

    return category;
};

const updateCategory = async (id, data) => {
    const categoryId = Number(id);

    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            isDeleted: false,
        },
    });

    if (!category) {
        throw new AppError("Category not found.", 404);
    }

    if (data.name) {
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: data.name,
                isDeleted: false,
                NOT: {
                    id: categoryId,
                },
            },
        });

        if (existingCategory) {
            throw new AppError("Category name already exists.", 409);
        }
    }

    return await prisma.category.update({
        where: {
            id: categoryId,
        },
        data,
    });
};

const deleteCategory = async (id) => {
    const categoryId = Number(id);

    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            isDeleted: false,
        },
        include: {
            products: {
                where: {
                    isDeleted: false,
                },
            },
        },
    });

    if (!category) {
        throw new AppError("Category not found.", 404);
    }

    if (category.products.length > 0) {
        throw new AppError(
            "Cannot delete category because it contains products.",
            400
        );
    }

    await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
            active: false,
        },
    });

    return;
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};