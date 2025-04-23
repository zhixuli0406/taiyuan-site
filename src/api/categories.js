import api from "./config"

export const getCategories = async () => {
  const response = await api.get("/categories")
  return response.data
}

export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData)
  return response.data
}

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData)
  return response.data
}

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`)
  return response.data
} 