import { createContext, useContext, useState, useCallback } from "react";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = useCallback((orderData) => {
    const newOrder = {
      _id: `o${Date.now()}`,
      orderId: orderData.orderId || `VNM${Date.now()}`,
      date: new Date().toLocaleDateString("vi-VN"),
      status: "pending",
      paymentMethod: orderData.paymentMethod,
      fullName: orderData.fullName,
      phone: orderData.phone,
      address: orderData.address,
      note: orderData.note || "",
      subtotal: orderData.subtotal,
      shipping: orderData.shipping || 0,
      total: orderData.total,
      items: orderData.items,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be inside OrderProvider");
  return ctx;
};

export default OrderContext;