import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider, useSelector } from "react-redux"
import { Auth0Provider } from "@auth0/auth0-react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import store from "./redux/store"
import { getStoreSettings } from "./api/storeSettings"
import { setStoreSettings, setError } from "./redux/slices/storeSettingsSlice"

// Pages
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CategoryPage from "./pages/CategoryPage"
import LoginPage from "./pages/LoginPage"
import UserProfilePage from "./pages/UserProfilePage"
import AboutUsPage from "./pages/AboutUsPage"
import CheckoutPage from "./pages/CheckoutPage"
import CartPage from "./pages/CartPage"
import NotFoundPage from "./pages/NotFoundPage"

// Components
import Header from "./components/Header"
import Footer from "./components/Footer"
import LineChatFloatingButton from "./components/LineChatFloatingButton"

// Helper function to determine if a color is light or dark
function isColorLight(hexColor) {
  if (!hexColor || hexColor.length < 7) return false; // Basic check
  const hex = hexColor.substring(1); // Remove #
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Formula for perceived brightness (YIQ)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150; // Adjust threshold if needed (128-186 are common)
}

const AppContent = () => {
  const dispatch = useDispatch()
  // Select settings from the correct slice (plural)
  const { settings: storeSettings, loading, error } = useSelector((state) => state.storeSettings); 

  // Effect to fetch settings on mount
  useEffect(() => {
    const fetchAndSetSettings = async () => {
      // We might need a setLoading action dispatch here if the slice supports it
      // dispatch(setLoading()); // Uncomment if setLoading exists and is needed
      try {
        const response = await getStoreSettings();
        console.log('Store Settings Response:', response);
        // Assuming response contains title and faviconUrl directly or nested
        if (response) {
          dispatch(setStoreSettings(response)); 
        } else {
          // Handle case where response is empty or invalid
          dispatch(setError('Invalid settings response from API'));
          console.error('Invalid settings response from API');
        }
      } catch (fetchError) {
        console.error("Error fetching store settings:", fetchError);
        dispatch(setError(fetchError.message || 'Failed to fetch settings'));
      }
    };
    fetchAndSetSettings();
  }, [dispatch]);

  // Effect to apply settings (theme, title, favicon) when they change
  useEffect(() => {
    if (storeSettings) {
      // Apply theme color
      const themeColor = storeSettings?.appearance?.themeColor
      if (themeColor) {
        document.documentElement.style.setProperty('--primary-theme-color', themeColor)
        const foregroundColor = isColorLight(themeColor) ? '#000000' : '#ffffff'
        document.documentElement.style.setProperty('--primary-theme-foreground', foregroundColor)
        console.log(`Theme color ${themeColor} and foreground ${foregroundColor} applied.`)
      }

      // Apply title - Check if title exists directly on settings or within a property
      const title = storeSettings.name ; // Adjust based on actual structure
      if (title) {
        document.title = title;
        console.log(`Document title set to: ${title}`)
      }

      // Apply favicon - Check if faviconUrl exists directly or nested
      const faviconUrl = storeSettings.appearance.logo; // Adjust based on actual structure
      if (faviconUrl) {
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = faviconUrl;
        console.log(`Favicon set to: ${faviconUrl}`)
      }
    }
  }, [storeSettings]) // Re-run this effect when storeSettings changes

  // Optional: Display loading/error state globally or handle differently
  // if (loading) return <div>Loading Store Settings...</div>;
  // if (error) return <div>Error loading settings: {error}</div>;

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
        <LineChatFloatingButton />
      </div>
    </Router>
  )
}

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Provider store={store}>
        <AppContent />
      </Provider>
    </Auth0Provider>
  )
}

export default App
