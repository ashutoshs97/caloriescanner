import { createSlice } from '@reduxjs/toolkit';

const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    todayLog: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchTodayStart: (state) => {
      state.loading = true;
    },
    fetchTodaySuccess: (state, action) => {
      state.loading = false;
      state.todayLog = action.payload;
    },
    fetchTodayFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchHistoryStart: (state) => {
      state.loading = true;
    },
    fetchHistorySuccess: (state, action) => {
      state.loading = false;
      state.history = action.payload;
    },
    fetchHistoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addLog: (state, action) => {
      // Add new log to history (prepend)
      state.history.unshift(action.payload);
      // If it's today's date, also update todayLog
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const logDate = new Date(action.payload.date);
      logDate.setHours(0, 0, 0, 0);
      if (today.getTime() === logDate.getTime()) {
        state.todayLog = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchTodayStart,
  fetchTodaySuccess,
  fetchTodayFailure,
  fetchHistoryStart,
  fetchHistorySuccess,
  fetchHistoryFailure,
  addLog,
  clearError,
} = logsSlice.actions;

export default logsSlice.reducer;