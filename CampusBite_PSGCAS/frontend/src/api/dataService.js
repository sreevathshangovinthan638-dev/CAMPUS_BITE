import API from "./axios";
import { CATEGORIES, INITIAL_FOODS, DEMO_USERS, INITIAL_KITCHEN_ORDERS } from "./mockData";

const STORAGE_KEYS = {
  FOODS: "campusbite_foods_cache",
  ORDERS: "campusbite_orders_cache",
  STATUS: "campusbite_backend_status",
};

// Check if Django is accessible
let backendAvailable = null;

export async function checkBackendHealth() {
  try {
    const res = await API.get("health/", { timeout: 2000 });
    backendAvailable = res.status === 200;
    return true;
  } catch (err) {
    backendAvailable = false;
    return false;
  }
}

export function isBackendConnected() {
  return backendAvailable === true;
}

// ---------------- FOODS ----------------
export async function fetchFoods(category = "all") {
  // Try Django backend first
  try {
    const res = await API.get("foods/?all=true", { timeout: 2500 });
    if (Array.isArray(res.data) && res.data.length > 0) {
      backendAvailable = true;
      localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(res.data));
      if (category && category !== "all") {
        return res.data.filter(
          (f) =>
            f.category === category ||
            f.category_name?.toLowerCase().includes(category.toLowerCase())
        );
      }
      return res.data;
    }
  } catch (err) {
    backendAvailable = false;
  }

  // Graceful fallback: localStorage cache or master mock data
  const cached = localStorage.getItem(STORAGE_KEYS.FOODS);
  let allFoods = cached ? JSON.parse(cached) : INITIAL_FOODS;

  if (category && category !== "all") {
    return allFoods.filter(
      (f) =>
        f.category === category ||
        f.category_name?.toLowerCase().includes(category.toLowerCase())
    );
  }
  return allFoods;
}

// ---------------- CATEGORIES ----------------
export async function fetchCategories() {
  try {
    const res = await API.get("categories/", { timeout: 2000 });
    if (Array.isArray(res.data) && res.data.length > 0) {
      backendAvailable = true;
      return res.data;
    }
  } catch (err) {
    backendAvailable = false;
  }
  return CATEGORIES;
}

// ---------------- ORDERS ----------------
export async function placeOrder(orderPayload) {
  try {
    const res = await API.post("orders/place/", orderPayload, { timeout: 3000 });
    backendAvailable = true;
    return {
      success: true,
      data: res.data,
      source: "backend",
    };
  } catch (err) {
    // Save to local cache seamlessly
    const localOrder = {
      id: Math.floor(100000 + Math.random() * 900000),
      orderCode: `CB${Date.now().toString().slice(-6)}`,
      customer_name: orderPayload.customer_name || "Campus Student",
      total_amount: orderPayload.total_amount,
      pickup_time: orderPayload.pickup_time,
      payment_method: orderPayload.payment_method,
      payment_status: orderPayload.payment_method === "upi",
      status: "pending",
      created_at: new Date().toISOString(),
      items: orderPayload.items,
    };

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
    existing.unshift(localOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(existing));

    return {
      success: true,
      data: localOrder,
      source: "local",
    };
  }
}

export async function fetchOrders() {
  try {
    const res = await API.get("orders/all/", { timeout: 2500 });
    backendAvailable = true;
    return res.data;
  } catch {
    backendAvailable = false;
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
    return existing.length > 0 ? existing : INITIAL_KITCHEN_ORDERS;
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await API.patch(`orders/status/${orderId}/`, { status: newStatus }, { timeout: 2500 });
    backendAvailable = true;
    return res.data;
  } catch {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
    const updated = existing.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    return { id: orderId, status: newStatus };
  }
}
