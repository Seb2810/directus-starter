import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './articlesSlice';
import authReducer from './authSlice';
import commentsReducer from './commentsSlice';
import singupReducer from './signupSlice';
import scrollReducer from './commentScroll';

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
     auth: authReducer,
      comments: commentsReducer,
      signup: singupReducer,
      scroll: scrollReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
