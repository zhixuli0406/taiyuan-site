import api from "./config"

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password
  })
  return response.data
}

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData)
  return response.data
}

export const logout = async () => {
  const response = await api.post("/auth/logout")
  return response.data
}

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token")
  return response.data
}

export const resetPassword = async (email) => {
  const response = await api.post("/auth/reset-password", { email })
  return response.data
}

export const verifyEmail = async (token) => {
  const response = await api.post("/auth/verify-email", { token })
  return response.data
} 