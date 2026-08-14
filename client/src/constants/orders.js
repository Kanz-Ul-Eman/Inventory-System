export const ORDER_STATUS_TRANSITIONS = {
  PENDING: ["CONFIRMED"],
  CONFIRMED: ["SHIPPED"],
};

export const ORDER_STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  CANCELLED: "Cancelled",
};

export function getNextOrderStatuses(status) {
  return ORDER_STATUS_TRANSITIONS[status] || [];
}

export function canUpdateOrderStatus(status) {
  return getNextOrderStatuses(status).length > 0;
}

export function canCancelOrder(status) {
  return status !== "CANCELLED" && status !== "SHIPPED";
}
