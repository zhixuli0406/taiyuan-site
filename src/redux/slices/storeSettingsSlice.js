import { createSlice } from "@reduxjs/toolkit"

// 初始狀態
const initialState = {
  settings: null,
  loading: false,
  error: null
}

const storeSettingsSlice = createSlice({
  name: "storeSettings",
  initialState,
  reducers: {
    // 設定商店設定
    setStoreSettings: (state, action) => {
      state.settings = action.payload
      state.loading = false
      state.error = null
    },
    // 設定載入狀態
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    // 設定錯誤狀態
    setError: (state, action) => {
      state.loading = false
      state.error = action.payload
    }
  }
})

export const { setStoreSettings, setLoading, setError } = storeSettingsSlice.actions
export default storeSettingsSlice.reducer 