import {
  FaBox,
  FaTags,
  FaUsers,
  FaShoppingCart,
  FaChartPie,
} from "react-icons/fa";

export const sidebarLinks = [
  {
    title: "Dashboard",
    path: "/",
    icon: FaChartPie,
  },
  {
    title: "Products",
    path: "/products",
    icon: FaBox,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: FaTags,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: FaUsers,
  },
  {
    title: "Orders",
    path: "/orders",
    icon: FaShoppingCart,
  },
];
