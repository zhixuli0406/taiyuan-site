import api from "./config"

export const login = async (email, password) => {
  const response = await api.post("/admin/login", { email, password })
  return response.data
}

export const createAdmin = async (adminData) => {
  const response = await api.post("/admin", adminData)
  return response.data
}

export const getAdmins = async () => {
  const response = await api.get("/admin")
  return response.data
}

export const updateAdmin = async (id, adminData) => {
  const response = await api.put(`/admin/${id}`, adminData)
  return response.data
} 