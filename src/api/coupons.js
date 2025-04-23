import api from "./config"

export const createCoupon = async (couponData) => {
  const response = await api.post("/coupons", couponData)
  return response.data
}

export const getCoupons = async () => {
  const response = await api.get("/coupons")
  return response.data
}

export const validateCoupon = async (code, totalAmount, productIds, categoryIds) => {
  const response = await api.post("/coupons/validate", {
    code,
    totalAmount,
    productIds,
    categoryIds
  })
  return response.data
}

export const deleteCoupon = async (id) => {
  const response = await api.delete(`/coupons/${id}`)
  return response.data
}

export const disableCoupon = async (id) => {
  const response = await api.put(`/coupons/${id}/disable`)
  return response.data
} 