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
    async (userId, {rejectWithValue }) => {
        try {
            const response = await axios.get(`https://movieapp-tu5n.onrender.com/user/getbookmark?userId=${userId}`);
            console.log("fetch", response.data);
            return response.data.bookmarks; // Assuming API returns bookmarks in this structure
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookmarks');
        }
    }
);

// Add a bookmark
export const addBookmark = createAsyncThunk(
    'bookmarks/addBookmark',
    async (bookmarkData, { rejectWithValue }) => {
        // const { token } = getState().auth; // Get the token from the state

        try {
            const response = await axios.post('https://movieapp-tu5n.onrender.com/user/bookmark', bookmarkData);
            return response.data.bookmarks; // Assuming API returns updated bookmarks
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add bookmark');
        }
    }
);

// Delete a bookmark
export const deleteBookmark = createAsyncThunk(
    'bookmarks/deleteBookmark',
    async (bookmarkData, { rejectWithValue }) => {
        try {
            const response = await axios.delete('https://movieapp-tu5n.onrender.com/user/deletebookmark', {
                data: bookmarkData, // Pass data here for DELETE requests
            });
            return response.data.bookmarks; // Assuming API returns updated bookmarks
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete bookmark');
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

            // Add bookmark
            .addCase(addBookmark.fulfilled, (state, action) => {
                state.bookmarks = action.payload; // Replace with updated bookmarks
            })
            .addCase(addBookmark.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete bookmark
            .addCase(deleteBookmark.fulfilled, (state, action) => {
                state.bookmarks = action.payload; // Replace with updated bookmarks array
            })
            .addCase(deleteBookmark.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default bookmarksSlice.reducer;
