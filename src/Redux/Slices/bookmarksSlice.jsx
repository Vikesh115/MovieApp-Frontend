import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    bookmarks: [],
    loading: false,
    error: null,
};

// Fetch bookmarks for a specific user
export const fetchBookmarks = createAsyncThunk(
    'bookmarks/fetchBookmarks',
    async (user, { rejectWithValue }) => {
        if (!user) {
            console.error("Invalid user data for fetching bookmarks.");
            return rejectWithValue('User ID is required.');
        }
        console.log("fetch bookmark called");
        try {
            const response = await axios.get(
                `https://movieapp-tu5n.onrender.com/user/getbookmark?userId=${encodeURIComponent(user)}`
            );
            console.log("Fetched bookmarks:", response?.data?.bookmarks);
            return response?.data?.bookmarks;
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookmarks');
        }
    }
);

// Toggle (add/remove) a bookmark
export const toggleBookmark = createAsyncThunk(
    'bookmarks/toggleBookmark',
    async ({ userId, itemId, type, isBookmarked }, { rejectWithValue }) => {
        try {
            console.log(userId, itemId, type, isBookmarked);
            const response = await axios.post("http://localhost:8000/user/togglebookmark", {
                userId,
                itemId,
                type,
                isBookmarked
            });
            console.log("Updated bookmarks:", response?.data?.bookmarks || []);
            return response?.data?.bookmarks || []; // Updated bookmarks list
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle bookmark');
        }
    }
);

// Bookmark slice
const bookmarksSlice = createSlice({
    name: 'bookmarks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch bookmarks
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
            // Toggle bookmark
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
