import api from "./config"

export const getPresignedUrl = async (fileType) => {
  const response = await api.get("/images/presigned-url", {
    params: { fileType }
  })
  return response.data
}

export const getImages = async () => {
  const response = await api.get("/images")
  return response.data
}

export const deleteImage = async (key) => {
  const response = await api.delete(`/images/${key}`)
  return response.data
}

export const updateImage = async (id, imageData) => {
  const response = await api.put(`/images/${id}`, imageData)
  return response.data
} 