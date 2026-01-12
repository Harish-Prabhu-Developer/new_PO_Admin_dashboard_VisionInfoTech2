import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Retrieve the base URL from config
const BASE_URL = `${API_URL}/PO/FilesUploadDetail4`;

// Async Thunks

// Fetch all files
export const fetchPOFilesUploadDetails4 = createAsyncThunk(
  'poFilesUploadDetail4/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch file by ID
export const fetchPOFilesUploadDetail4ById = createAsyncThunk(
  'poFilesUploadDetail4/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create new file
export const createPOFilesUploadDetail4 = createAsyncThunk(
  'poFilesUploadDetail4/create',
  async (fileData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, fileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update existing file
export const updatePOFilesUploadDetail4 = createAsyncThunk(
  'poFilesUploadDetail4/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete file
export const deletePOFilesUploadDetail4 = createAsyncThunk(
  'poFilesUploadDetail4/delete',
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
const poFilesUploadDetail4Slice = createSlice({
  name: 'poFilesUploadDetail4',
  initialState: {
    files: [],
    currentFile: null,
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
    resetCurrentFile: (state) => {
      state.currentFile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPOFilesUploadDetails4.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOFilesUploadDetails4.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchPOFilesUploadDetails4.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch By ID
      .addCase(fetchPOFilesUploadDetail4ById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOFilesUploadDetail4ById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
      })
      .addCase(fetchPOFilesUploadDetail4ById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createPOFilesUploadDetail4.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPOFilesUploadDetail4.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.files.push(action.payload);
      })
      .addCase(createPOFilesUploadDetail4.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update
      .addCase(updatePOFilesUploadDetail4.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePOFilesUploadDetail4.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.files.findIndex((file) => file.sno === action.payload.sno);
        if (index !== -1) {
          state.files[index] = action.payload;
        }
        if (state.currentFile && state.currentFile.sno === action.payload.sno) {
          state.currentFile = action.payload;
        }
      })
      .addCase(updatePOFilesUploadDetail4.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete
      .addCase(deletePOFilesUploadDetail4.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePOFilesUploadDetail4.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter((file) => file.sno !== action.payload);
      })
      .addCase(deletePOFilesUploadDetail4.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetCurrentFile } = poFilesUploadDetail4Slice.actions;
export default poFilesUploadDetail4Slice.reducer;
