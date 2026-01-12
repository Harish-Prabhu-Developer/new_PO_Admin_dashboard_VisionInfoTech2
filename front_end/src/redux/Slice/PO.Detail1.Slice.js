import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Base URL
const BASE_URL = `${API_URL}/PO/Detail1`;

// Async Thunks

// Fetch all details
export const fetchPODetails1 = createAsyncThunk(
  'poDetail1/fetchAll',
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
export const fetchPODetail1BySno = createAsyncThunk(
  'poDetail1/fetchBySno',
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
export const createPODetail1 = createAsyncThunk(
  'poDetail1/create',
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
export const updatePODetail1 = createAsyncThunk(
  'poDetail1/update',
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
export const deletePODetail1 = createAsyncThunk(
  'poDetail1/delete',
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
const poDetail1Slice = createSlice({
  name: 'poDetail1',
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
      .addCase(fetchPODetails1.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPODetails1.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchPODetails1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch By ID
      .addCase(fetchPODetail1BySno.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPODetail1BySno.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDetail = action.payload;
      })
      .addCase(fetchPODetail1BySno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createPODetail1.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPODetail1.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.details.push(action.payload);
      })
      .addCase(createPODetail1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update
      .addCase(updatePODetail1.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePODetail1.fulfilled, (state, action) => {
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
      .addCase(updatePODetail1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete
      .addCase(deletePODetail1.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePODetail1.fulfilled, (state, action) => {
        state.loading = false;
        state.details = state.details.filter((item) => item.sno !== action.payload);
      })
      .addCase(deletePODetail1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetCurrentDetail } = poDetail1Slice.actions;
export default poDetail1Slice.reducer;
