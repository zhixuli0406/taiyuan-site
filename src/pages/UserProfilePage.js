import { useAuth0 } from "@auth0/auth0-react"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Package, CreditCard, User, Settings, LogOut, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

const UserProfilePage = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth0()
  const { orders } = useSelector((state) => state.orders)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">我的帳戶</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <img
                src={user.picture || "/placeholder.svg"}
                alt={user.name}
                className="w-16 h-16 rounded-full mr-4" />
              <div>
                <h2 className="font-bold text-lg">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <a
                href="#orders"
                className="flex items-center p-3 rounded-md bg-primary/10 text-primary">
                <Package className="w-5 h-5 mr-3" />
                我的訂單
              </a>
              <a
                href="#payment"
                className="flex items-center p-3 rounded-md hover:bg-gray-100">
                <CreditCard className="w-5 h-5 mr-3" />
                付款方式
              </a>
              <a
                href="#profile"
                className="flex items-center p-3 rounded-md hover:bg-gray-100">
                <User className="w-5 h-5 mr-3" />
                個人資料
              </a>
              <a
                href="#settings"
                className="flex items-center p-3 rounded-md hover:bg-gray-100">
                <Settings className="w-5 h-5 mr-3" />
                帳戶設定
              </a>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="flex items-center p-3 rounded-md hover:bg-gray-100 w-full text-left text-red-600">
                <LogOut className="w-5 h-5 mr-3" />
                登出
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Orders Section */}
          <section id="orders" className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">我的訂單</h2>

            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-sm text-gray-500">訂單編號: {order.id}</span>
                        <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}>
                          {order.status === "completed"
                            ? "已完成"
                            : order.status === "processing"
                              ? "處理中"
                              : order.status === "shipped"
                                ? "已出貨"
                                : "待處理"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
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
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-4 pt-4 flex justify-between">
                      <span className="font-medium">總計</span>
                      <span className="font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">您目前沒有任何訂單。</p>
                <a href="/products" className="btn-primary">
                  開始購物
                </a>
              </div>
            )}
          </section>

          {/* Profile Section */}
          <section id="profile" className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">個人資料</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input type="text" defaultValue={user.name} className="input-field" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="input-field bg-gray-100" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
                  <input type="tel" className="input-field" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">生日</label>
                  <input type="date" className="input-field" />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">送貨地址</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                    <input type="text" className="input-field" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                    <input type="text" className="input-field" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">郵遞區號</label>
                    <input type="text" className="input-field" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  儲存變更
                </button>
              </div>
            </form>
          </section>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/cart" className="flex items-center p-3 rounded-md bg-primary/10 text-primary">
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span>View Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage
