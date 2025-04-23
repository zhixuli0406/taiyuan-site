"use client"

import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "../redux/slices/categorySlice"
import { Skeleton } from "./ui/skeleton"
import { ChevronRight, ChevronDown } from "lucide-react"

const CategoryItem = ({ category, level = 0 }) => {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const isActive = location.pathname === `/category/${category._id}`
  const hasChildren = category.children && category.children.length > 0

  // 如果有子分类且当前分类是活动分类的父分类，则展开
  useEffect(() => {
    if (hasChildren) {
      const isParentOfActive = category.children.some(
        child => location.pathname === `/category/${child._id}`
      )
      if (isParentOfActive) {
        setIsExpanded(true)
      }
    }
  }, [location.pathname, category.children, hasChildren])

  return (
    <div className="space-y-1">
      <div className="flex items-center">
        <Link
          to={`/category/${category._id}`}
          className={`flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
            isActive ? "bg-primary/10 text-primary" : ""
          }`}
          style={{ paddingLeft: `${level * 1 + 1}rem` }}
        >
          <div className="flex items-center justify-between">
            <span>{category.name}</span>
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsExpanded(!isExpanded)
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </Link>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {category.children.map((child) => (
            <CategoryItem key={child._id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

const CategorySidebar = () => {
  const dispatch = useDispatch()
  const { categories, loading, error } = useSelector((state) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // 调试代码
  console.log('Categories data:', categories)
  console.log('Categories type:', typeof categories)
  console.log('Is Array:', Array.isArray(categories))

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">商品分類</h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">商品分類</h2>
        <p className="text-red-500">載入分類時發生錯誤</p>
      </div>
    )
  }

  // 确保 categories 是数组
  const categoriesList = Array.isArray(categories) ? categories : []

  // 只顯示頂層分類
  const topLevelCategories = categoriesList.filter(category => 
    !category.parentCategory && 
    category.isActive // 只显示启用的分类
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">商品分類</h2>
      <nav className="space-y-1">
        {topLevelCategories.map((category) => (
          <CategoryItem key={category._id} category={category} />
        ))}
      </nav>
    </div>
  )
}

export default CategorySidebar
