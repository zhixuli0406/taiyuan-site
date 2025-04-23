  "use client"

  import { useEffect } from "react"
  import { Link } from "react-router-dom"
  import { useDispatch, useSelector } from "react-redux"
  import { fetchProducts, fetchTopProducts } from "../redux/slices/productSlice"
  import { fetchCarousels } from "../redux/slices/carouselSlice"
  import { fetchCategories } from "../redux/slices/categorySlice"
  import ProductCard from "../components/ProductCard"
  import { ArrowRight } from "lucide-react"
  import LoadingSpinner from "../components/LoadingSpinner"
  import ErrorMessage from "../components/ErrorMessage"
  import Carousel from "../components/Carousel"
  const HomePage = () => {
    const dispatch = useDispatch()
    const { products, topProducts, loading: productsLoading, error: productsError } = useSelector((state) => state.products)
    const { items: carouselItems, loading: carouselLoading, error: carouselError } = useSelector((state) => state.carousels)
    const { rootCategories, loading: categoryLoading, error: categoryError } = useSelector((state) => state.categories)

    useEffect(() => {
      dispatch(fetchCarousels())
      dispatch(fetchProducts())
      dispatch(fetchTopProducts())
      dispatch(fetchCategories())
    }, [dispatch])

    const isLoading = productsLoading || carouselLoading || categoryLoading
    const error = productsError || carouselError || categoryError

    if (isLoading && !rootCategories.length) return <LoadingSpinner />
    if (error) return <ErrorMessage message={`頁面載入錯誤: ${error}`} />

    // Determine which products to display
    let productsToDisplay = []
    if (topProducts && topProducts.length > 0) {
      productsToDisplay = topProducts.slice(0, 5)
    } else if (products && products.length > 0) {
      productsToDisplay = products.slice(0, 5)
    }

    // Determine which root categories to display (take first 5)
    const rootCategoriesToDisplay = rootCategories ? rootCategories.slice(0, 4) : []

    return (
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Carousel Section */}
        <div className="mb-12">
          {carouselLoading && <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>}
          {carouselError && <ErrorMessage message={`無法載入輪播圖: ${carouselError}`} />}
          {!carouselLoading && !carouselError && carouselItems.length > 0 && (
            <Carousel items={carouselItems} />
          )}
          {!carouselLoading && !carouselError && carouselItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">暫無輪播圖內容</div>
          )}
        </div>

        {/* Hot Selling / Latest Products Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">熱銷商品</h2>
            <Link
              to="/products"
              className="text-primary hover:text-primary/90 flex items-center">
              查看全部 <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {productsLoading && productsToDisplay.length === 0 && <LoadingSpinner />}
          {productsError && productsToDisplay.length === 0 && <ErrorMessage message={`無法載入商品: ${productsError}`} />}
          {!productsLoading && productsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsToDisplay.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            !productsLoading && !productsError && <div className="text-center py-8 text-gray-500">暫無商品</div>
          )}
        </div>

        {/* Root Categories Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">分類</h2>
            <Link
              to="/products"
              className="text-primary hover:text-primary/90 flex items-center">
              查看全部 <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {categoryLoading && rootCategoriesToDisplay.length === 0 && <LoadingSpinner />}
          {categoryError && rootCategoriesToDisplay.length === 0 && <ErrorMessage message={`無法載入分類: ${categoryError}`} />}
          {!categoryLoading && rootCategoriesToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rootCategoriesToDisplay.map((category) => (
                <Link key={category._id} to={`/category/${category._id}`} className="relative rounded-lg overflow-hidden group border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-center text-md font-semibold">{category.name}</h3>
                  </div>
                  <div className="p-2 text-center">
                    <h3 className="text-gray-700 text-sm font-medium truncate">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !categoryLoading && !categoryError && <div className="text-center py-8 text-gray-500">暫無分類</div>
          )}
        </div>
      </div>
    );
  }

  export default HomePage
