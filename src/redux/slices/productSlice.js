import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getProducts, getProductById } from "../../api/products"
import { getTopProducts } from "../../api/analytics"

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  try {
    const response = await getProducts()
    console.log('Products response:', response)
    // 检查 response 的结构
    if (response && response.products) {
      return Array.isArray(response.products) ? response.products : []
    }
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error("獲取商品列表失敗:", error)
    return []
  }
})

export const fetchFeaturedProducts = createAsyncThunk("products/fetchFeaturedProducts", async () => {
  const response = await getProducts({ featured: true })
  return Array.isArray(response) ? response : []
})

export const fetchProductById = createAsyncThunk("products/fetchProductById", async (id) => {
  try {
    if (!id) {
      throw new Error("商品 ID 不能為空")
    }
    const response = await getProductById(id)
    if (response && response.product) {
      return response.product
    }
    if (response && response._id) {
      return response
    }
    throw new Error("無法獲取商品詳情")
  } catch (error) {
    console.error("獲取商品詳情失敗:", error)
    throw error
  }
})

export const fetchProductsByCategory = createAsyncThunk("products/fetchProductsByCategory", async (categoryId) => {
  try {
    if (!categoryId) {
      throw new Error("分類 ID 不能為空")
    }
    const response = await getProducts({ 
      category: categoryId
    })
    console.log('Category products response:', response)
    
    // 檢查 response 的結構
    if (response && response.products) {
      return Array.isArray(response.products) ? response.products : []
    }
    return Array.isArray(response) ? response : []
  } catch (error) {
    console.error("獲取分類商品失敗:", error)
    return []
  }
})

export const fetchTopProducts = createAsyncThunk(
  "products/fetchTopProducts", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTopProducts(5) 
      console.log('Top products response:', response)
      if (response && response.topProducts) { 
        return Array.isArray(response.topProducts) ? response.topProducts : []
      }
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error("獲取熱銷商品失敗:", error)
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    featuredProducts: [],
    topProducts: [],
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // fetchFeaturedProducts
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false
        state.featuredProducts = action.payload
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // fetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // fetchTopProducts
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false
        state.topProducts = action.payload
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  },
})

export default productSlice.reducer
