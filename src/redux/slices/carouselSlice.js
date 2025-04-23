import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCarousels as fetchCarouselsApi } from '../../api/carousels';

// Async thunk for fetching carousels
export const fetchCarousels = createAsyncThunk(
  'carousels/fetchCarousels',
  async (_, { rejectWithValue }) => {
    try {
      const carousels = await fetchCarouselsApi();
      return carousels;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch carousels');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const carouselSlice = createSlice({
  name: 'carousels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarousels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarousels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCarousels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default carouselSlice.reducer; 