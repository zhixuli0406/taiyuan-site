"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearCart } from "../redux/slices/cartSlice"
import { createOrder } from "../redux/slices/orderSlice"
import { CreditCard, Truck, ShieldCheck } from "lucide-react"

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: cartItems } = useSelector((state) => state.cart)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">您的購物車是空的</h1>
        <p className="text-gray-600 mb-8">請先將商品加入購物車再進行結帳。</p>
        <button onClick={() => navigate("/products")} className="btn-primary">
          繼續購物
        </button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 60
  const total = subtotal + shipping

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "zipCode"]
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "此欄位為必填"
      }
    })

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "請輸入有效的電子郵件地址"
    }

    // Phone validation
    if (formData.phone && !/^\d{8,10}$/.test(formData.phone)) {
      newErrors.phone = "請輸入有效的電話號碼"
    }

    // Credit card validation if payment method is credit card
    if (formData.paymentMethod === "credit_card") {
      if (!formData.cardNumber) {
        newErrors.cardNumber = "請輸入信用卡號碼"
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "請輸入有效的信用卡號碼"
      }

      if (!formData.cardExpiry) {
        newErrors.cardExpiry = "請輸入到期日"
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = "格式應為 MM/YY"
      }

      if (!formData.cardCvc) {
        newErrors.cardCvc = "請輸入安全碼"
      } else if (!/^\d{3,4}$/.test(formData.cardCvc)) {
        newErrors.cardCvc = "請輸入有效的安全碼"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Here you would integrate with ECPay (綠界) for payment processing
      // For this example, we'll simulate a successful payment

      // Create order in Redux store
      const orderData = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: cartItems,
        total,
        shipping,
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        },
        paymentMethod: formData.paymentMethod,
        status: "processing",
      }

      dispatch(createOrder(orderData))
      dispatch(clearCart())

      // Redirect to success page
      navigate("/checkout/success", { state: { orderId: orderData.id } })
    } catch (error) {
      console.error("Checkout error:", error)
      setErrors({ submit: "結帳過程中發生錯誤，請稍後再試。" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">結帳</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            {/* Customer Information */}
            <h2 className="text-xl font-bold mb-4">客戶資訊</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓氏 *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? "border-red-500" : ""}`} />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名字 *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field ${errors.firstName ? "border-red-500" : ""}`} />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件 *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? "border-red-500" : ""}`} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話 *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field ${errors.phone ? "border-red-500" : ""}`} />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Shipping Information */}
            <h2 className="text-xl font-bold mb-4">送貨資訊</h2>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地址 *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`input-field ${errors.address ? "border-red-500" : ""}`} />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">城市 *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`input-field ${errors.city ? "border-red-500" : ""}`} />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">郵遞區號 *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`input-field ${errors.zipCode ? "border-red-500" : ""}`} />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <h2 className="text-xl font-bold mb-4">付款方式</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-4">
                <label
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === "credit_card"}
                    onChange={handleChange}
                    className="mr-3 focus:ring-primary text-primary"
                  />
                  <CreditCard className="w-6 h-6 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Credit Card</p>
                    <p className="text-sm text-gray-500">Pay with Visa, Mastercard, JCB or American Express</p>
                  </div>
                </label>

                <label
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="atm"
                    checked={formData.paymentMethod === "atm"}
                    onChange={handleChange}
                    className="mr-3" />
                  <div>
                    <p className="font-medium">ATM 轉帳</p>
                    <p className="text-sm text-gray-500">使用 ATM 或網路銀行轉帳</p>
                  </div>
                </label>

                <label
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="convenience_store"
                    checked={formData.paymentMethod === "convenience_store"}
                    onChange={handleChange}
                    className="mr-3" />
                  <div>
                    <p className="font-medium">超商付款</p>
                    <p className="text-sm text-gray-500">7-11, 全家, 萊爾富, OK 超商</p>
                  </div>
                </label>
              </div>

              {formData.paymentMethod === "credit_card" && (
                <div className="mt-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">卡號 *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className={`input-field ${errors.cardNumber ? "border-red-500" : ""}`} />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">到期日 *</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={`input-field ${errors.cardExpiry ? "border-red-500" : ""}`} />
                      {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">安全碼 *</label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="CVC"
                        className={`input-field ${errors.cardCvc ? "border-red-500" : ""}`} />
                      {errors.cardCvc && <p className="text-red-500 text-sm mt-1">{errors.cardCvc}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {errors.submit && <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-lg">{errors.submit}</div>}

            <button type="submit" className="btn-primary w-full py-3" disabled={isProcessing}>
              {isProcessing ? "處理中..." : "確認付款"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">訂單摘要</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4" />
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">數量: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
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

            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <Truck className="w-5 h-5 text-gray-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">運送政策</p>
                  <p className="text-sm text-gray-600">訂單滿 $500 免運費，否則運費為 $60</p>
                </div>
              </div>
              <div className="flex items-start">
                <ShieldCheck className="w-5 h-5 text-gray-600 mt-0.5 mr-3" />
                <div>
                  <p className="font-medium">安全付款</p>
                  <p className="text-sm text-gray-600">您的付款資訊將被安全加密</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage
