"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductById } from "../redux/slices/productSlice"
import { addToCart } from "../redux/slices/cartSlice"
import { fetchTransports } from "../redux/slices/transportSlice"
import { Minus, Plus, Star, Truck, ShieldCheck, ArrowLeft, ChevronRight } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { Link, useNavigate } from "react-router-dom"

const ProductDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, loading, error } = useSelector((state) => state.products)
  const { transports, loading: transportsLoading, error: transportsError } = useSelector((state) => state.transports)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [note, setNote] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
      dispatch(fetchTransports())
    }
  }, [dispatch, id])

  const getTransportInfo = (transportId) => {
    if (!Array.isArray(transports)) {
      console.error('運輸方式不是一個陣列:', transports);
      return null;
    }
    const transport = transports.find(transport => transport._id === transportId);
    if (!transport) {
      console.warn('未找到運輸方式:', { transportId, allTransports: transports });
    }
    return transport;
  }

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({
        id: currentProduct._id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.images[0],
        quantity,
        note: currentProduct.isCustomizable ? note : undefined
      }))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-200 h-20 w-20 rounded"></div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">無法載入商品資訊。請稍後再試。</p>
        <button onClick={() => dispatch(fetchProductById(id))} className="btn-primary">
          重新載入
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-gray-500 mb-6">
        <Link to="/products" className="text-sm text-gray-500 hover:text-gray-700">Products</Link>
        <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
        {/* Consider linking to category if applicable */}
        <span className="text-sm text-gray-700">{currentProduct.name}</span>
      </nav>

      {/* Breadcrumbs alternative */} 
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="mb-4">
            <img
              src={currentProduct.images[selectedImage] || "/placeholder.svg"}
              alt={currentProduct.name}
              className="w-full h-[500px] object-contain rounded-lg bg-gray-50" />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {currentProduct.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border-2 rounded-md overflow-hidden ${
                  selectedImage === index ? "border-blue-500" : "border-transparent"
                }`}>
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${currentProduct.name} - 圖片 ${index + 1}`}
                  className="w-20 h-20 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{currentProduct.name}</h1>

          {/* Price */}
          <div className="mb-6">
            {currentProduct.originalPrice && (
              <span className="text-gray-400 line-through text-lg mr-2">
                ${currentProduct.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-primary">${currentProduct.price.toFixed(2)}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: currentProduct.description }}
            />
          </div>

          {/* Shipping Information */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">運送資訊</h3>
            <div className="space-y-2">
              {transportsError ? (
                <div className="text-red-500">載入運送方式失敗: {transportsError}</div>
              ) : transportsLoading ? (
                <div className="text-gray-500">載入中...</div>
              ) : currentProduct.transport && currentProduct.transport.length > 0 ? (
                currentProduct.transport.map((transport, index) => (
                  <div key={transport._id} className="flex items-center justify-between py-2">
                    <span className="flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-gray-600" />
                      {transport.name} ({transport.description})
                    </span>
                    <span className="text-primary font-medium">${transport.fee?.toFixed(2) || '0.00'}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">
                  此商品暫無運送方式
                </div>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4">數量:</span>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border-r"
                disabled={quantity <= 1}>
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="px-3 py-1 border-l"
                disabled={quantity >= currentProduct.stock}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="ml-2 text-sm text-gray-500">
              庫存: {currentProduct.stock}
            </span>
          </div>

          {/* Note Field - Only show if product is customizable */}
          {currentProduct.isCustomizable && (
            <div className="mb-6">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                備注
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="請輸入您的定制要求..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          )}

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart} 
            className="btn-primary w-full py-3 mb-6"
            disabled={quantity > currentProduct.stock}>
            {quantity > currentProduct.stock ? '庫存不足' : '加入購物車'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage
