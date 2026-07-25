const { PrismaClient, Role, OrderStatus } = require('@prisma/client'); 
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // -------------------------
  // Clear Database
  // -------------------------

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // -------------------------
  // Password Hash
  // -------------------------

  const password = await bcrypt.hash("Admin@123", 10);

  // -------------------------
  // Users
  // -------------------------

  const admin = await prisma.user.create({
    data: {
      name: "Muhammad Ali",
      email: "admin@inventory.pk",
      passwordHash: password,
      role: Role.ADMIN,
    },
  });

  const staff1 = await prisma.user.create({
    data: {
      name: "Ayesha Khan",
      email: "ayesha@inventory.pk",
      passwordHash: password,
      role: Role.STAFF,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      name: "Hassan Raza",
      email: "hassan@inventory.pk",
      passwordHash: password,
      role: Role.STAFF,
    },
  });

  // -------------------------
  // Categories
  // -------------------------

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Electronic gadgets",
    },
  });

  const grocery = await prisma.category.create({
    data: {
      name: "Grocery",
      description: "Daily grocery items",
    },
  });

  const beverages = await prisma.category.create({
    data: {
      name: "Beverages",
      description: "Drinks",
    },
  });

  const stationery = await prisma.category.create({
    data: {
      name: "Stationery",
      description: "Office supplies",
    },
  });

  const appliances = await prisma.category.create({
    data: {
      name: "Home Appliances",
      description: "Kitchen appliances",
    },
  });

  // -------------------------
  // Products
  // -------------------------

  const products = [];

  products.push(
    await prisma.product.create({
      data: {
        name: "Samsung Galaxy A16",
        sku: "ELE001",
        categoryId: electronics.id,
        unitPrice: 54999,
        quantityInStock: 20,
        reorderLevel: 5,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "HP Laptop 15",
        sku: "ELE002",
        categoryId: electronics.id,
        unitPrice: 185000,
        quantityInStock: 10,
        reorderLevel: 2,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Logitech Mouse",
        sku: "ELE003",
        categoryId: electronics.id,
        unitPrice: 3500,
        quantityInStock: 50,
        reorderLevel: 10,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Basmati Rice 5kg",
        sku: "GRO001",
        categoryId: grocery.id,
        unitPrice: 2400,
        quantityInStock: 40,
        reorderLevel: 8,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Atta 10kg",
        sku: "GRO002",
        categoryId: grocery.id,
        unitPrice: 1800,
        quantityInStock: 30,
        reorderLevel: 5,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Olper's Milk 1L",
        sku: "GRO003",
        categoryId: grocery.id,
        unitPrice: 340,
        quantityInStock: 80,
        reorderLevel: 20,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Coca-Cola 1.5L",
        sku: "BEV001",
        categoryId: beverages.id,
        unitPrice: 220,
        quantityInStock: 100,
        reorderLevel: 20,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Sting Energy",
        sku: "BEV002",
        categoryId: beverages.id,
        unitPrice: 120,
        quantityInStock: 120,
        reorderLevel: 25,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Dollar Pen Blue",
        sku: "STA001",
        categoryId: stationery.id,
        unitPrice: 45,
        quantityInStock: 500,
        reorderLevel: 100,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Notebook A4",
        sku: "STA002",
        categoryId: stationery.id,
        unitPrice: 180,
        quantityInStock: 200,
        reorderLevel: 50,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Anex Blender",
        sku: "HOM001",
        categoryId: appliances.id,
        unitPrice: 9800,
        quantityInStock: 15,
        reorderLevel: 4,
      },
    }),
  );

  products.push(
    await prisma.product.create({
      data: {
        name: "Westpoint Kettle",
        sku: "HOM002",
        categoryId: appliances.id,
        unitPrice: 4800,
        quantityInStock: 20,
        reorderLevel: 5,
      },
    }),
  );

  // -------------------------
  // Customers
  // -------------------------

  const customer1 = await prisma.customer.create({
    data: {
      name: "Ahmed Raza",
      email: "ahmed@gmail.com",
      phone: "03011234567",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Fatima Noor",
      email: "fatima@gmail.com",
      phone: "03124567890",
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: "Ali Hamza",
      email: "ali@gmail.com",
      phone: "03331234567",
    },
  });

  const customer4 = await prisma.customer.create({
    data: {
      name: "Sara Khan",
      email: "sara@gmail.com",
      phone: "03211239876",
    },
  });

  const customer5 = await prisma.customer.create({
    data: {
      name: "Usman Malik",
      email: "usman@gmail.com",
      phone: "03079876543",
    },
  });

  // -------------------------
  // Orders
  // -------------------------

  async function createOrder(customer, user, status, items) {
    let total = 0;

    const orderItems = items.map((item) => {
      const lineTotal = item.product.unitPrice * item.quantity;
      total += lineTotal;

      return {
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.unitPrice,
        lineTotal,
      };
    });

    return prisma.order.create({
      data: {
        customerId: customer.id,
        createdById: user.id,
        status,
        totalAmount: total,
        orderItems: {
          create: orderItems,
        },
      },
    });
  }

  await createOrder(customer1, staff1, OrderStatus.PENDING, [
    { product: products[0], quantity: 1 },
    { product: products[2], quantity: 2 },
  ]);

  await createOrder(customer2, staff1, OrderStatus.CONFIRMED, [
    { product: products[3], quantity: 2 },
    { product: products[6], quantity: 5 },
  ]);

  await createOrder(customer3, staff2, OrderStatus.SHIPPED, [
    { product: products[1], quantity: 1 },
    { product: products[8], quantity: 10 },
  ]);

  await createOrder(customer4, staff2, OrderStatus.CANCELLED, [
    { product: products[10], quantity: 1 },
    { product: products[11], quantity: 2 },
  ]);

  await createOrder(customer5, staff1, OrderStatus.CONFIRMED, [
    { product: products[5], quantity: 6 },
    { product: products[7], quantity: 10 },
  ]);

  console.log("✅ Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });