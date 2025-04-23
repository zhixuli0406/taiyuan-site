import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useAuth0 } from "@auth0/auth0-react"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { getStoreSettings } from "../api/storeSettings"
import { setStoreSettings } from "../redux/slices/storeSettingsSlice"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()
  const cartItems = useSelector((state) => state.cart.items)
  const { settings: storeSettings, loading } = useSelector((state) => state.storeSettings)
  console.log('Current Store Settings:', storeSettings)

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const response = await getStoreSettings()
        console.log('Header Store Settings Response:', response)
        if (response) {
          dispatch(setStoreSettings(response))
        }
      } catch (error) {
        console.error("獲取商店設置失敗:", error)
      }
    }
    fetchStoreSettings()
  }, [dispatch])

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {loading ? (
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 animate-pulse mr-2"></div>
                <div className="h-6 w-32 bg-gray-200 animate-pulse"></div>
              </div>
            ) : storeSettings?.appearance?.logo ? (
              <div className="flex items-center">
                <img 
                  src={storeSettings.appearance.logo} 
                  alt={storeSettings.name} 
                  className="h-8 mr-2" 
                  onError={(e) => {
                    console.error('圖片載入失敗:', e.target.src)
                    e.target.style.display = 'none'
                  }}
                />
                <span className="text-xl font-bold text-gray-800">{storeSettings.name}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 animate-pulse mr-2"></div>
                <div className="h-6 w-32 bg-gray-200 animate-pulse"></div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary">
              首頁
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary">
              所有商品
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary">
              關於我們
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center text-gray-700 hover:text-primary">
                  <User className="w-5 h-5 mr-1" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="text-gray-700 hover:text-primary">
                  登出
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="text-gray-700 hover:text-primary">
                登入
              </button>
            )}

            <Link to="/cart" className="relative text-gray-700 hover:text-primary">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary">
                首頁
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-primary">
                所有商品
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary">
                關於我們
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-primary">
                    個人資料
                  </Link>
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="text-left text-gray-700 hover:text-primary">
                    登出
                  </button>
                </>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="text-left text-gray-700 hover:text-primary">
                  登入
                </button>
              )}

              <Link
                to="/cart"
                className="flex items-center text-gray-700 hover:text-primary">
                <ShoppingCart className="w-5 h-5 mr-2" />
                購物車 {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header
