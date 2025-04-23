import api from "./config"

export const getCustomers = async (page = 0, per_page = 50) => {
  const response = await api.get("/customers", {
    params: { page, per_page }
  })
  return response.data
}

export const createCustomer = async (customerData) => {
  const response = await api.post("/customers", customerData)
  return response.data
}

export const syncCustomers = async () => {
  const response = await api.post("/customers/sync")
  return response.data
}

export const getCurrentCustomer = async () => {
  const response = await api.get("/customers/me")
  return response.data
} 