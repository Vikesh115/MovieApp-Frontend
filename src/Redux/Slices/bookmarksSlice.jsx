import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    bookmarks: [],
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
            await new Promise(resolve => setTimeout(resolve, 2000));
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
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await axios.post("https://movieapp-tu5n.onrender.com/user/togglebookmark", {
                userId,
                itemId,
                type
            });
            const updatedBookmarks = response?.data?.bookmarks || [];
            dispatch(fetchBookmarks(userId));
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookmarks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookmarks.fulfilled, (state, action) => {
                state.loading = false;
                state.bookmarks = action.payload;
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
            })
            .addCase(toggleBookmark.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bookmarksSlice.reducer;
