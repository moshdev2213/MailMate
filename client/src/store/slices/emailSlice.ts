import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { EmailState, Email } from '../../types/email.types';
import { emailService } from '../../services/email.service';

const initialState: EmailState = {
  emails: [],
  pagination: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  searchQuery: '',
};

// Async thunks
export const fetchEmails = createAsyncThunk(
  'email/fetchEmails',
  async (params: { limit?: number; offset?: number; refresh?: boolean; fetchLimit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await emailService.getEmails(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch emails');
    }
  }
);

export const refreshEmails = createAsyncThunk(
  'email/refreshEmails',
  async (fetchLimit: number = 50, { rejectWithValue }) => {
    try {
      const response = await emailService.getEmails({ refresh: true, fetchLimit, limit: 20, offset: 0 });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to refresh emails');
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearEmails: (state) => {
      state.emails = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch emails
      .addCase(fetchEmails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.emails = action.payload.emails;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Refresh emails
      .addCase(refreshEmails.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshEmails.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.emails = action.payload.emails;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(refreshEmails.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, clearError, clearEmails } = emailSlice.actions;
export default emailSlice.reducer;

