import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { ShoppingCart } from "lucide-react"
import { addToCart } from "../redux/slices/cartSlice"
import { Badge } from "../components/ui/badge"

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  // 獲取第一張產品圖片，如果沒有則使用預設圖片
  const getProductImage = () => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0]
    }
    return "/placeholder.svg"
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product._id) {
      console.error("商品 ID 不能為空")
      return
    }
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: getProductImage(),
      quantity: 1,
    }))
  }

  // 移除 HTML 標籤並限制字數
  const getTruncatedDescription = (html) => {
    if (!html) return ""
    // 移除 HTML 標籤
    const text = html.replace(/<[^>]*>/g, "")
    // 限制為 50 個字符
    return text.length > 50 ? text.substring(0, 50) + "..." : text
  }

  if (!product._id || !product.isActive) {
    console.error("商品 ID 不能為空或商品未啟用")
    return null
  }

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-300">
        <div className="relative overflow-hidden">
          <img
            src={getProductImage()}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              -{product.discount}%
            </Badge>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 h-14 overflow-hidden group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div 
            className="text-gray-500 text-sm mb-2 line-clamp-1"
            dangerouslySetInnerHTML={{ __html: getTruncatedDescription(product.description) }}
          />

          <div className="flex items-center justify-between">
            <div>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-sm mr-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <button 
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
