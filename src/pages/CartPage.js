import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { updateCartItemQuantity, removeFromCart, clearCart } from "../redux/slices/cartSlice"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from "lucide-react"

const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return
    dispatch(updateCartItemQuantity({ id, quantity }))
  }

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 60
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-4">您的購物車是空的</h1>
          <p className="text-gray-600 mb-8">看起來您還沒有將任何商品加入購物車。</p>
          <Link to="/products" className="btn-primary">
            繼續購物
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">購物車</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium">
              <div className="col-span-6">商品</div>
              <div className="col-span-2 text-center">單價</div>
              <div className="col-span-2 text-center">數量</div>
              <div className="col-span-2 text-center">小計</div>
            </div>

            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded mr-4" />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      {item.note && (
                        <div className="text-sm text-gray-600 mt-1">
                          備注: {item.note}
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 text-sm flex items-center mt-1 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        移除
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="md:hidden inline-block mr-2 font-medium">單價:</span>${item.price.toFixed(2)}
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <span className="md:hidden inline-block mr-2 font-medium">數量:</span>
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-2 py-1 border-r"
                        disabled={item.quantity <= 1}>
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-2 py-1 border-l">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-medium">
                    <span className="md:hidden inline-block mr-2 font-medium">小計:</span>$
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 flex justify-between items-center">
              <Link to="/products" className="flex items-center text-gray-600 hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>

              <button
                onClick={() => dispatch(clearCart())}
                className="text-red-500 hover:text-red-700 flex items-center">
                <Trash2 className="w-4 h-4 mr-1" />
                清空購物車
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">訂單摘要</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>小計</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>運費</span>
                <span>{shipping === 0 ? "免費" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>總計</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {subtotal < 500 && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-4">
                再購買 ${(500 - subtotal).toFixed(2)} 即可享有免運費！
              </div>
            )}

            <Link to="/checkout" className="btn-primary w-full py-3 block text-center">
              前往結帳
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage
