import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Base URL
const BASE_URL = `${API_URL}/PO/ConversationDetail3`;

// Async Thunks

// Fetch all conversation details
export const fetchPOConversationDetails3 = createAsyncThunk(
  'poConversationDetail3/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch conversation detail by ID
export const fetchPOConversationDetail3ById = createAsyncThunk(
  'poConversationDetail3/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create new conversation detail
export const createPOConversationDetail3 = createAsyncThunk(
  'poConversationDetail3/create',
  async (detailData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, detailData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update existing conversation detail
export const updatePOConversationDetail3 = createAsyncThunk(
  'poConversationDetail3/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete conversation detail
export const deletePOConversationDetail3 = createAsyncThunk(
  'poConversationDetail3/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id; // Return the ID of the deleted item
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const poConversationDetail3Slice = createSlice({
  name: 'poConversationDetail3',
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
      .addCase(fetchPOConversationDetails3.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOConversationDetails3.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchPOConversationDetails3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch By ID
      .addCase(fetchPOConversationDetail3ById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOConversationDetail3ById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDetail = action.payload;
      })
      .addCase(fetchPOConversationDetail3ById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createPOConversationDetail3.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPOConversationDetail3.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.details.push(action.payload);
      })
      .addCase(createPOConversationDetail3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update
      .addCase(updatePOConversationDetail3.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePOConversationDetail3.fulfilled, (state, action) => {
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
      .addCase(updatePOConversationDetail3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete
      .addCase(deletePOConversationDetail3.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePOConversationDetail3.fulfilled, (state, action) => {
        state.loading = false;
        state.details = state.details.filter((item) => item.sno !== action.payload);
      })
      .addCase(deletePOConversationDetail3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetCurrentDetail } = poConversationDetail3Slice.actions;
export default poConversationDetail3Slice.reducer;
