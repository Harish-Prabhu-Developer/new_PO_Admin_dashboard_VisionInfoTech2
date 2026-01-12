import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Base URL
const BASE_URL = `${API_URL}/PO/Dashboard`;
// getHeader function for bearer token
const getHeader = () => {
    const token = localStorage.getItem('tbgs_access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}
// Async Thunks
export const fetchPODashboardData = createAsyncThunk(
    'poDashboard/fetchPODashboardData',
    async () => {
        try {
            const response = await axios.get(BASE_URL, getHeader());
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Slice
const poDashboardSlice = createSlice({
    name: 'poDashboard',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => { 
        builder
            .addCase(fetchPODashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPODashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchPODashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            });
    },
});

export default poDashboardSlice.reducer;
