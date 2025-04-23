import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transportApi } from '../../api/transport';

export const fetchTransports = createAsyncThunk(
  'transports/fetchTransports',
  async (_, { rejectWithValue }) => {
    try {
      const data = await transportApi.getAllTransports();
      return data;
    } catch (error) {
      console.error('獲取運輸方式失敗:', error);
      return rejectWithValue(error.response?.data || '獲取運輸方式失敗');
    }
  }
);

const transportSlice = createSlice({
  name: 'transports',
  initialState: {
    transports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransports.fulfilled, (state, action) => {
        state.loading = false;
        state.transports = Array.isArray(action.payload) ? action.payload : 
                         (action.payload.transports || []);
      })
      .addCase(fetchTransports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default transportSlice.reducer; 