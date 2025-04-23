import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories, getCategoryById } from "../../api/categories"

// 处理分类数据，构建树形结构
const buildCategoryTree = (categories) => {
  if (!Array.isArray(categories)) return []

  // 创建分类映射
  const categoryMap = {}
  categories.forEach(category => {
    categoryMap[category._id] = { 
      ...category, 
      children: [],
      allProducts: category.products || [] // 初始化所有商品列表
    }
  })

  // 构建树形结构
  const tree = []
  categories.forEach(category => {
    const categoryWithChildren = categoryMap[category._id]
    if (category.parentCategory && category.parentCategory._id) {
      // 如果有父分类，添加到父分类的 children 中
      const parent = categoryMap[category.parentCategory._id]
      if (parent) {
        parent.children.push(categoryWithChildren)
        // 将子分类的商品添加到父分类的 allProducts 中
        parent.allProducts = [...parent.allProducts, ...(category.products || [])]
      }
    } else {
      // 如果没有父分类，添加到顶层
      tree.push(categoryWithChildren)
    }
  })

  // 递归处理所有层级的商品
  const processCategoryProducts = (category) => {
    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        processCategoryProducts(child)
        // 将子分类的商品添加到父分类的 allProducts 中
        category.allProducts = [...category.allProducts, ...child.allProducts]
      })
    }
  }

  // 处理每个顶层分类
  tree.forEach(category => {
    processCategoryProducts(category)
  })

  return tree
}

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  try {
    const response = await getCategories()
    console.log('Categories response:', response)
    // Return the raw categories list for processing in the reducer
    if (response && response.categories) {
      return Array.isArray(response.categories) ? response.categories : [];
    }
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Re-throw error or return a rejected promise value
    throw error;
  }
})

export const fetchCategoryById = createAsyncThunk("categories/fetchCategoryById", async (id) => {
  try {
    // 先獲取當前分類
    const currentCategory = await getCategoryById(id)
    if (!currentCategory) {
      throw new Error("找不到該分類")
    }

    // 獲取所有分類
    const allCategoriesResponse = await getCategories()
    const allCategories = Array.isArray(allCategoriesResponse) ? allCategoriesResponse : 
                         (allCategoriesResponse.categories || [])

    // 創建分類映射
    const categoryMap = {}
    allCategories.forEach(category => {
      categoryMap[category._id] = { 
        ...category, 
        children: []
      }
    })

    // 構建樹形結構
    allCategories.forEach(category => {
      if (category.parentCategory && category.parentCategory._id) {
        const parent = categoryMap[category.parentCategory._id]
        if (parent) {
          parent.children.push(categoryMap[category._id])
        }
      }
    })

    // 返回當前分類及其子分類
    const result = categoryMap[id]
    if (!result) {
      console.warn("無法找到分類的完整樹結構，返回基本分類信息")
      return currentCategory
    }

    return result
  } catch (error) {
    console.error('獲取分類失敗:', error)
    throw error
  }
})

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    currentCategory: null,
    rootCategories: [],
    categoryLoading: false,
    categoryError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.categoryLoading = true
        state.categoryError = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoryLoading = false
        const rawCategories = action.payload
        // Build the tree (optional, if needed elsewhere)
        state.categories = buildCategoryTree(rawCategories)
        // Filter for root categories and store them
        state.rootCategories = rawCategories.filter(
          (category) => !category.parentCategory || !category.parentCategory._id
        )
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoryLoading = false
        state.categoryError = action.error.message
        state.rootCategories = [] // Clear on error
      })

      // fetchCategoryById
      .addCase(fetchCategoryById.pending, (state) => {
        state.categoryLoading = true
        state.categoryError = null
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.categoryLoading = false
        state.currentCategory = action.payload
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.categoryLoading = false
        state.categoryError = action.error.message
      })
  },
})

export default categorySlice.reducer
