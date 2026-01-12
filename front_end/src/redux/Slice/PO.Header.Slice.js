import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Base URL
const BASE_URL = `${API_URL}/PO/Header`;

// Async Thunks

// Fetch all headers
export const fetchPOHeaders = createAsyncThunk(
  'poHeader/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch header by po_ref_no
export const fetchPOHeaderByRefNo = createAsyncThunk(
  'poHeader/fetchByRefNo',
  async (po_ref_no, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${po_ref_no}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create new header
export const createPOHeader = createAsyncThunk(
  'poHeader/create',
  async (headerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, headerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update existing header
export const updatePOHeader = createAsyncThunk(
  'poHeader/update',
  async ({ po_ref_no, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${po_ref_no}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete header
export const deletePOHeader = createAsyncThunk(
  'poHeader/delete',
  async (po_ref_no, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${po_ref_no}`);
      return po_ref_no; // Return the ID of the deleted item
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const poHeaderSlice = createSlice({
  name: 'poHeader',
  initialState: {
    headers: [],
    currentHeader: null,
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
    resetCurrentHeader: (state) => {
      state.currentHeader = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPOHeaders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOHeaders.fulfilled, (state, action) => {
        state.loading = false;
        state.headers = action.payload;
      })
      .addCase(fetchPOHeaders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch By ID
      .addCase(fetchPOHeaderByRefNo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOHeaderByRefNo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHeader = action.payload;
      })
      .addCase(fetchPOHeaderByRefNo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createPOHeader.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPOHeader.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.headers.push(action.payload);
      })
      .addCase(createPOHeader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update
      .addCase(updatePOHeader.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePOHeader.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.headers.findIndex((item) => item.po_ref_no === action.payload.po_ref_no);
        if (index !== -1) {
          state.headers[index] = action.payload;
        }
        if (state.currentHeader && state.currentHeader.po_ref_no === action.payload.po_ref_no) {
          state.currentHeader = action.payload;
        }
      })
      .addCase(updatePOHeader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete
      .addCase(deletePOHeader.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePOHeader.fulfilled, (state, action) => {
        state.loading = false;
        state.headers = state.headers.filter((item) => item.po_ref_no !== action.payload);
      })
      .addCase(deletePOHeader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetCurrentHeader } = poHeaderSlice.actions;
export default poHeaderSlice.reducer;
