import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    bookmarks: [],
    bookMarked: localStorage.getItem("bookMarked") 
    ? JSON.parse(localStorage.getItem("bookMarked")) : false,
    loading: false,
    error: null,
};

export const fetchBookmarks = createAsyncThunk(
    'bookmarks/fetchBookmarks',
    async (user, { rejectWithValue }) => {
        if (!user) {
            console.error("Invalid user data for fetching bookmarks.");
            return rejectWithValue('User ID is required.');
        }
        try {
            const response = await axios.get(
                `https://movieapp-tu5n.onrender.com/user/getbookmark?userId=${encodeURIComponent(user)}`
            );
            return response?.data?.bookmarks;
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookmarks');
        }
    }
);


export const toggleBookmark = createAsyncThunk(
    'bookmarks/toggleBookmark',
    async ({ userId, itemId, type }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post("https://movieapp-tu5n.onrender.com/user/togglebookmark", {
                userId,
                itemId,
                type
            });
            const updatedBookmarks = response?.data?.bookmarks || [];
            dispatch(fetchBookmarks(userId));
            dispatch(setLogo(updatedBookmarks.some(item => item.isBookmarked))); 
            return updatedBookmarks;
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle bookmark');
        }
    }
);


const bookmarksSlice = createSlice({
    name: 'bookmarks',
    initialState,
    reducers: {
        setLogo(state, action) {
            state.bookMarked = action.payload
            localStorage.setItem('bookMarked', JSON.stringify(action.bookMarked));
    }},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookmarks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookmarks.fulfilled, (state, action) => {
                state.loading = false;
                state.bookmarks = action.payload;
                localStorage.setItem('bookMarked', JSON.stringify(true)); 
            })
            .addCase(fetchBookmarks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleBookmark.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleBookmark.fulfilled, (state, action) => {
                state.loading = false;
                state.bookmarks = action.payload;
                localStorage.setItem('bookMarked', JSON.stringify(true));
            })
            .addCase(toggleBookmark.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setLogo } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
