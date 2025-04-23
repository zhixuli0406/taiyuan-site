import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} DU DU Technology Studio Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer
