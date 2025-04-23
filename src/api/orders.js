import api from "./config"

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData)
  return response.data
}

export const getOrders = async () => {
  const response = await api.get("/orders")
  return response.data
}

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders")
  return response.data
}

export const updateOrder = async (id, orderData) => {
  const response = await api.put(`/orders/${id}`, orderData)
  return response.data
}

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`)
  return response.data
}

export const handlePaymentCallback = async (callbackData) => {
  const response = await api.post("/orders/payment/callback", callbackData)
  return response.data
}

export const handleLogisticsCallback = async (callbackData) => {
  const response = await api.post("/orders/logistics/callback", callbackData)
  return response.data
} 