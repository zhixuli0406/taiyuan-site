import api from "./config"

export const createInventory = async (inventoryData) => {
  const response = await api.post("/inventory", inventoryData)
  return response.data
}

export const updateInventory = async (id, quantityChange) => {
  const response = await api.put(`/inventory/${id}`, {
    quantityChange
  })
  return response.data
}

export const getInventoryByProduct = async (productId) => {
  const response = await api.get(`/inventory/${productId}`)
  return response.data
}

export const getLowStockItems = async () => {
  const response = await api.get("/inventory/low-stock")
  return response.data
}

export const resetInventory = async (productId, quantity) => {
  const response = await api.put(`/inventory/reset/${productId}`, {
    quantity
  })
  return response.data
} 