import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import logsReducer from './logsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    logs: logsReducer,
  },
});

export default store;