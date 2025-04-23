import { Link } from "react-router-dom"
import { Home } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-bold mb-4">頁面不存在</h2>
        <p className="text-gray-600 mb-8">很抱歉，您所尋找的頁面不存在或已被移除。</p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <Home className="w-4 h-4 mr-2" />
          返回首頁
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage
