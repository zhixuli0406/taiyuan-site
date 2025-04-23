import { createSlice } from "@reduxjs/toolkit"

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
  },
  reducers: {
    createOrder: (state, action) => {
      state.orders.unshift(action.payload)
    },
  },
})

export const { createOrder } = orderSlice.actions

export default orderSlice.reducer
