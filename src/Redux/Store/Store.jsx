import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slices/authSlice';
import bookmarksReducer from '../Slices/bookmarksSlice';
import searchReducer from '../Slices/searchSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        bookmarks: bookmarksReducer,
        search: searchReducer,
    },
});

export default store;
