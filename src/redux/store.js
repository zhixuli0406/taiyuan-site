import { configureStore } from "@reduxjs/toolkit"
import productReducer from "./slices/productSlice"
import categoryReducer from "./slices/categorySlice"
import cartReducer from "./slices/cartSlice"
import orderReducer from "./slices/orderSlice"
import storeSettingsReducer from "./slices/storeSettingsSlice"
import transportReducer from "./slices/transportSlice"
import carouselReducer from "./slices/carouselSlice"

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    orders: orderReducer,
    storeSettings: storeSettingsReducer,
    transports: transportReducer,
    carousels: carouselReducer,
  },
})

export default store
