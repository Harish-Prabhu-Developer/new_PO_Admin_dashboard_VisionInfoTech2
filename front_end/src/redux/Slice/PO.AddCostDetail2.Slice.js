import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Base URL
const BASE_URL = `${API_URL}/PO/AddCostDetail2`;

// Async Thunks

// Fetch all details
export const fetchPOAddCostDetails2 = createAsyncThunk(
  'poAddCostDetail2/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch detail by sno
export const fetchPOAddCostDetail2BySno = createAsyncThunk(
  'poAddCostDetail2/fetchBySno',
  async (sno, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${sno}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create new detail
export const createPOAddCostDetail2 = createAsyncThunk(
  'poAddCostDetail2/create',
  async (detailData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, detailData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update existing detail
export const updatePOAddCostDetail2 = createAsyncThunk(
  'poAddCostDetail2/update',
  async ({ sno, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${sno}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete detail
export const deletePOAddCostDetail2 = createAsyncThunk(
  'poAddCostDetail2/delete',
  async (sno, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${sno}`);
      return sno; // Return the ID of the deleted item
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const poAddCostDetail2Slice = createSlice({
  name: 'poAddCostDetail2',
  initialState: {
    details: [],
    currentDetail: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetCurrentDetail: (state) => {
      state.currentDetail = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPOAddCostDetails2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOAddCostDetails2.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchPOAddCostDetails2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch By ID
      .addCase(fetchPOAddCostDetail2BySno.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOAddCostDetail2BySno.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDetail = action.payload;
      })
      .addCase(fetchPOAddCostDetail2BySno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createPOAddCostDetail2.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPOAddCostDetail2.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.details.push(action.payload);
      })
      .addCase(createPOAddCostDetail2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update
      .addCase(updatePOAddCostDetail2.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePOAddCostDetail2.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.details.findIndex((item) => item.sno === action.payload.sno);
        if (index !== -1) {
          state.details[index] = action.payload;
        }
        if (state.currentDetail && state.currentDetail.sno === action.payload.sno) {
          state.currentDetail = action.payload;
        }
      })
      .addCase(updatePOAddCostDetail2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete
      .addCase(deletePOAddCostDetail2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePOAddCostDetail2.fulfilled, (state, action) => {
        state.loading = false;
        state.details = state.details.filter((item) => item.sno !== action.payload);
      })
      .addCase(deletePOAddCostDetail2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetCurrentDetail } = poAddCostDetail2Slice.actions;
export default poAddCostDetail2Slice.reducer;
