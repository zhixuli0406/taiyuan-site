import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductsByCategory } from "../redux/slices/productSlice"
import { fetchCategoryById } from "../redux/slices/categorySlice"
import { fetchTransports } from "../redux/slices/transportSlice"
import ProductCard from "../components/ProductCard"
import CategorySidebar from "../components/CategorySidebar"
import { Skeleton } from "../components/ui/skeleton"
import { Truck } from "lucide-react"
import { Link } from "react-router-dom"

const CategoryPage = () => {
  const { categoryId } = useParams()
  const dispatch = useDispatch()
  const { products, loading: productsLoading } = useSelector((state) => state.products)
  const { currentCategory, loading: categoryLoading } = useSelector((state) => state.categories)
  const { transports, loading: transportsLoading } = useSelector((state) => state.transports)
  const [allProducts, setAllProducts] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [priceRange, setPriceRange] = useState(['', ''])
  const [selectedTransports, setSelectedTransports] = useState([])

  // 獲取所有子分類的商品
  const fetchAllCategoryProducts = async (category) => {
    if (!category) return []

    let products = []
    const seenProductIds = new Set() // 用于跟踪已添加的商品ID
    
    try {
      // 獲取當前分類的商品
      const currentProducts = await dispatch(fetchProductsByCategory(category._id)).unwrap()
      
      // 过滤掉已添加的商品
      const newProducts = currentProducts.filter(product => {
        if (seenProductIds.has(product._id)) {
          return false
        }
        seenProductIds.add(product._id)
        return true
      })
      
      products = [...products, ...newProducts]

      // 如果有子分類，遞歸獲取子分類的商品
      if (category.children && category.children.length > 0) {
        for (const child of category.children) {
          const childProducts = await fetchAllCategoryProducts(child)
          products = [...products, ...childProducts]
        }
      }
    } catch (error) {
      console.error("獲取商品失敗:", error)
    }

    return products
  }

  useEffect(() => {
    const loadProducts = async () => {
      if (categoryId) {
        setIsFetching(true)
        try {
          // 獲取分類信息
          const categoryResult = await dispatch(fetchCategoryById(categoryId)).unwrap()
          
          if (categoryResult) {
            // 獲取所有商品
            const products = await fetchAllCategoryProducts(categoryResult)
            setAllProducts(products)
          }
        } catch (error) {
          console.error("加載商品失敗:", error)
        } finally {
          setIsFetching(false)
        }
      }
    }
    loadProducts()
  }, [dispatch, categoryId])

  useEffect(() => {
    dispatch(fetchTransports())
  }, [dispatch])

  const filteredProducts = allProducts.filter(product => {
    // 價格篩選
    const minPrice = priceRange[0] === '' ? 0 : Number(priceRange[0])
    const maxPrice = priceRange[1] === '' ? Infinity : Number(priceRange[1])
    const priceInRange = product.price >= minPrice && product.price <= maxPrice
    
    // 運輸方式篩選
    const matchesTransport = selectedTransports.length === 0 || 
      (product.transport && product.transport.some(transportId => 
        selectedTransports.includes(transportId.toString())
      ))
    
    return priceInRange && matchesTransport
  })

  const handleClearFilters = () => {
    setPriceRange(['', ''])
    setSelectedTransports([])
  }

  const isLoading = productsLoading || categoryLoading || isFetching || transportsLoading

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        </div>
      ) : (
        <h1 className="text-3xl font-bold mb-8">{currentCategory ? currentCategory.name : "分類商品"}</h1>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <CategorySidebar />
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">篩選條件</h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:text-primary/90"
              >
                清除篩選
              </button>
            </div>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">價格範圍</h4>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                  placeholder="最低"
                />
                <span>至</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                  className="w-24 px-2 py-1 border rounded"
                  min="0"
                  placeholder="最高"
                />
              </div>
            </div>

            {/* Transport Filter */}
            <div>
              <h4 className="font-medium mb-2">運送方式</h4>
              <div className="space-y-2">
                {transportsLoading ? (
                  <div className="text-gray-500">載入中...</div>
                ) : transports && transports.length > 0 ? (
                  transports.map((transport) => (
                    <label key={transport._id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTransports.includes(transport._id.toString())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTransports([...selectedTransports, transport._id.toString()])
                          } else {
                            setSelectedTransports(selectedTransports.filter(id => id !== transport._id.toString()))
                          }
                        }}
                        className="mr-2"
                      />
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-1 text-blue-500" />
                        <span>{transport.name}</span>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="text-gray-500">暫無運送方式</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">沒有找到符合條件的商品。</p>
            </div>
          ) : (
            <>
              {currentCategory && currentCategory.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentCategory.description }} />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage
