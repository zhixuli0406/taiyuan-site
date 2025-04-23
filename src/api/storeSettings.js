import api from "./config"

// 獲取商店設定
export const getStoreSettings = async () => {
  const response = await api.get("/store-settings")
  return response.data
}

// 更新商店設定
export const updateStoreSettings = async (settings) => {
  const response = await api.put("/store-settings", settings)
  return response.data
}

// 獲取 Logo 上傳用的預簽名 URL
export const getLogoPresignedUrl = async (fileType) => {
  const response = await api.get("/store-settings/logo/presigned-url", {
    params: { fileType }
  })
  return response.data
}

// 更新商店 Logo
export const updateStoreLogo = async (imageUrl) => {
  const response = await api.put("/store-settings/logo", {
    imageUrl
  })
  return response.data
} 