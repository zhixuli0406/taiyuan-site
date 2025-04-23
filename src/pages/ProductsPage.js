import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts, fetchProductsByCategory } from "../redux/slices/productSlice"
import { fetchTransports } from "../redux/slices/transportSlice"
import ProductCard from "../components/ProductCard"
import CategorySidebar from "../components/CategorySidebar"
import { Search, SlidersHorizontal, Truck } from "lucide-react"
import { Skeleton } from "../components/ui/skeleton"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

const ProductsPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { products, loading, error } = useSelector((state) => state.products)
  const { transports, loading: transportsLoading } = useSelector((state) => state.transports)
  const [searchTerm, setSearchTerm] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedTransports, setSelectedTransports] = useState([])
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductsByCategory(id))
    } else {
      dispatch(fetchProducts())
    }
    dispatch(fetchTransports())
  }, [dispatch, id])

  // 確保 products 是一個數組
  const productsArray = Array.isArray(products) ? products : []

  // Filter and sort products
  const filteredProducts = productsArray
    .filter((product) => {
      const matchesSearch = product.isActive && 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPrice = (!minPrice || product.price >= Number(minPrice)) && 
        (!maxPrice || product.price <= Number(maxPrice))
      
      const matchesTransport = selectedTransports.length === 0 || 
        (Array.isArray(product.transport) && 
         product.transport.some(transport => 
           selectedTransports.includes(transport._id.toString())))
      
      return matchesSearch && matchesPrice && matchesTransport
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )

  const renderError = () => (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">無法載入商品。請稍後再試。</p>
      <button 
        onClick={() => dispatch(fetchProducts())} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        重新載入
      </button>
    </div>
  )

  const renderNoResults = () => (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">沒有符合條件的商品。</p>
      <button
        onClick={() => {
          setSearchTerm("")
          setMinPrice("")
          setMaxPrice("")
        }}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        清除篩選
      </button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">所有商品</h1>
      
      {/* Mobile Filter Toggle */}
      <button
        className="md:hidden flex items-center justify-center w-full py-2 mb-4 bg-gray-100 rounded-lg"
        onClick={() => setShowFilters(!showFilters)}
      >
        <SlidersHorizontal className="w-5 h-5 mr-2" />
        {showFilters ? "隱藏篩選" : "顯示篩選"}
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - Categories and Filters */}
        <div
          className={`md:w-1/4 space-y-6 ${showFilters ? "block" : "hidden md:block"}`}
        >
          <CategorySidebar />

          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">篩選</h2>

            {/* Price Range */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">價格範圍</h3>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  placeholder="最低價格"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
                <span>至</span>
                <input
                  type="number"
                  placeholder="最高價格"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <button
                onClick={() => {
                  setMinPrice("")
                  setMaxPrice("")
                }}
                className="text-sm text-primary hover:text-primary/90"
              >
                清除價格篩選
              </button>
            </div>

            {/* Transport Methods */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">運送方式</h3>
              {transportsLoading ? (
                <div className="text-gray-500">載入中...</div>
              ) : (
                <div className="space-y-2">
                  {Array.isArray(transports) && transports.map((transport) => (
                    <label key={transport._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTransports.includes(transport._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTransports([...selectedTransports, transport._id])
                          } else {
                            setSelectedTransports(selectedTransports.filter(id => id !== transport._id))
                          }
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary/50"
                      />
                      <span className="flex items-center">
                        <Truck className="w-4 h-4 mr-1 text-primary" />
                        {transport.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <button
                onClick={() => setSelectedTransports([])}
                className="text-sm text-primary hover:text-primary/90 mt-2"
              >
                清除運送方式篩選
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="搜尋商品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">最新上架</option>
              <option value="price-low">價格由低至高</option>
              <option value="price-high">價格由高至低</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            renderLoadingSkeleton()
          ) : error ? (
            renderError()
          ) : filteredProducts.length === 0 ? (
            renderNoResults()
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
