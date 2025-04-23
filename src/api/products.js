import api from "./config"

export const createProduct = async (productData) => {
  const response = await api.post("/products", productData)
  return response.data
}

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params })
  return response.data
}

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

export const getProductPresignedUrl = async (fileType) => {
  const response = await api.get("/products/presigned-url", {
    params: { fileType }
  })
  return response.data
} 