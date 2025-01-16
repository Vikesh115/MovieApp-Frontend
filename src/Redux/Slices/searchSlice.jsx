import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
    results: [], // Array to store multiple search results
    loading: false,
    error: null,
};

// Async thunk for searching movie or tv
export const searchAllItems = createAsyncThunk(
    'search/searchAllItems',
    async (search, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://movieapp-tu5n.onrender.com/movieandtv/getTvorMovie/${search}`);
            return response.data; // Expecting an array of results from the backend
        } catch (error) {
            // Return meaningful error message
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

// Async thunk for searching movie
export const searchMovieItems = createAsyncThunk(
    'search/searchMovieItems',
    async (search, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://movieapp-tu5n.onrender.com/movie/getMovie/${search}`);
            return response.data; // Expecting an array of results from the backend
        } catch (error) {
            // Return meaningful error message
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

// Async thunk for searching tv
export const searchTvItems = createAsyncThunk(
    'search/searchTvItems',
    async (search, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://movieapp-tu5n.onrender.com/tv/getTv/${search}`);
            return response.data; // Expecting an array of results from the backend
        } catch (error) {
            // Return meaningful error message
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

// searchBookmarkItems
export const searchBookmarkItems = createAsyncThunk(
    'search/searchBookmarkItems',
    async ({ userId, search }, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://movieapp-tu5n.onrender.com/user/searchbookmark', {
                userId,
                search
            });
            console.log(response.data.results);
            return response.data.results; // Expecting an array of results from the backend
        } catch (error) {
            // Return meaningful error message
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);


// Create the search slice
const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        // Optional: Clear search results
        clearSearchResults(state) {
            state.results = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // search bookmark
            .addCase(searchBookmarkItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchBookmarkItems.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload; // Update with search results
            })
            .addCase(searchBookmarkItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Search failed';
            })
            // search movie
            .addCase(searchMovieItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMovieItems.fulfilled, (state, action) => {
                state.loading = false;
                state.results = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(searchMovieItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // search tv
            .addCase(searchTvItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchTvItems.fulfilled, (state, action) => {
                state.loading = false;
                state.results = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(searchTvItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // search all movie or tv
            .addCase(searchAllItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchAllItems.fulfilled, (state, action) => {
                state.loading = false;
                state.results = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(searchAllItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { clearSearchResults } = searchSlice.actions;

// Export the reducer
export default searchSlice.reducer;
