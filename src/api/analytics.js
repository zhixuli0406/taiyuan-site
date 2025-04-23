import api from "./config"

export const getOverview = async () => {
  const response = await api.get("/analytics/overview")
  return response.data
}

export const getSales = async (start, end) => {
  const response = await api.get("/analytics/sales", {
    params: { start, end }
  })
  return response.data
}

export const getStatus = async () => {
  const response = await api.get("/analytics/status")
  return response.data
}

export const getTopProducts = async (limit) => {
  const response = await api.get("/analytics/top-products", {
    params: { limit }
  })
  return response.data
} 