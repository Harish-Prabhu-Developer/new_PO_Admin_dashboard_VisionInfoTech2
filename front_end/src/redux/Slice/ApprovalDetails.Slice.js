import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Base URL for Dashboard related endpoints
const BASE_URL = `${API_URL}/PO/Dashboard`;

// Helper to get auth header
const getHeader = () => {
    const token = localStorage.getItem('tbgs_access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Async Thunk to fetch Approval Details by SNO
export const fetchApprovalDetails = createAsyncThunk(
    'approvalDetails/fetchApprovalDetails',
    async (sno) => {
        try {
            const response = await axios.get(`${BASE_URL}/approval-details/${sno}`, getHeader());
            console.log(response);

            return response.data; // Expecting { length: number, rows: [] }
        } catch (error) {
            throw error;
        }
    }
);

// Async Thunk to Update Approval Status
export const updateApprovalStatus = createAsyncThunk(
    'approvalDetails/updateApprovalStatus',
    async ({ ids, status, remarks }) => {
        try {
            const response = await axios.post(`${BASE_URL}/update-status`, { ids, status, remarks }, getHeader());
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

const approvalDetailsSlice = createSlice({
    name: 'approvalDetails',
    initialState: {
        data: { length: 0, rows: [] },
        loading: false,
        error: null,
    },
    reducers: {
        clearApprovalDetails: (state) => {
            state.data = { length: 0, rows: [] };
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApprovalDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApprovalDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                console.log(state.data);
            })
            .addCase(fetchApprovalDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            })
            // Update Approval Status
            .addCase(updateApprovalStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateApprovalStatus.fulfilled, (state) => {
                state.loading = false;
                // We'll let the component trigger a refetch or we could update local state here
            })
            .addCase(updateApprovalStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error;
            });
    },
});

export const { clearApprovalDetails } = approvalDetailsSlice.actions;
export default approvalDetailsSlice.reducer;
