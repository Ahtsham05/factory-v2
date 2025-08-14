import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import Axios from '../utils/Axios';
import summery from '../utils/summery';
import { catchAsync, handleLoadingErrorParamsForAsycThunk, reduxToolKitCaseBuilder } from '../utils/errorHandler';

interface RoznamchaState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RoznamchaState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchRoznamchas = createAsyncThunk(
  'roznamcha/fetchRoznamchas',
  catchAsync(async (params?: { page?: number; limit?: number; sortBy?: string; search?: string; fieldName?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await Axios({
      ...summery.fetchRoznamchas,
      url: `${summery.fetchRoznamchas.url}?${query}`,
    });
    return response.data;
  })
);

export const addRoznamcha = createAsyncThunk(
  'roznamcha/addRoznamcha',
  catchAsync(async (roznamchaData: any) => {
    const response = await Axios({
      ...summery.addRoznamcha,
      data: roznamchaData,
    });
    return response.data;
  })
);

export const updateRoznamcha = createAsyncThunk(
  'roznamcha/updateRoznamcha',
  catchAsync(async ({ _id, ...roznamchaData }: any) => {
    const response = await Axios({
      ...summery.updateRoznamcha,
      url: `${summery.updateRoznamcha.url}/${_id}`,
      data: roznamchaData,
    });
    return response.data;
  })
);

export const deleteRoznamcha = createAsyncThunk(
  'roznamcha/deleteRoznamcha',
  catchAsync(async (id: string) => {
    await Axios({
      ...summery.deleteRoznamcha,
      url: `${summery.deleteRoznamcha.url}/${id}`,
    });
    return id;
  })
);

const roznamchaSlice = createSlice({
  name: 'roznamcha',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoznamchas.fulfilled, (state, action) => {
        state.data = action.payload.results || action.payload;
      })
      .addCase(addRoznamcha.fulfilled, (state, action) => {
        if (state.data?.length) {
          state.data.push(action.payload);
        } else {
          state.data = [action.payload];
        }
      })
      .addCase(updateRoznamcha.fulfilled, (state, action) => {
        if (Array.isArray(state.data)) {
          state.data = state.data.map((entry) =>
            entry._id === action.payload._id ? action.payload : entry,
          );
        }
      })
      .addCase(deleteRoznamcha.fulfilled, (state, action) => {
        if (Array.isArray(state.data)) {
          state.data = state.data.filter((entry) => entry._id !== action.payload);
        }
      })
      .addMatcher(
        isAnyOf(...reduxToolKitCaseBuilder([fetchRoznamchas, addRoznamcha, updateRoznamcha, deleteRoznamcha])),
        handleLoadingErrorParamsForAsycThunk,
      );
  },
});

export default roznamchaSlice.reducer;
