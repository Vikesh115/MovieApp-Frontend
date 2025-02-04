import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    results: [],
    loading: false,
    error: null,
};

export const searchAllItems = createAsyncThunk(
    'search/searchAllItems',
    async (search, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://movieapp-tu5n.onrender.com/movieandtv/getTvorMovie/${search}`);
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

export const searchMovieItems = createAsyncThunk(
    'search/searchMovieItems',
    async (search, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://movieapp-tu5n.onrender.com/movie/getMovie/${search}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

export const searchTvItems = createAsyncThunk(
    'search/searchTvItems',
    async (search, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://movieapp-tu5n.onrender.com/tv/getTv/${search}`);
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

export const searchBookmarkItems = createAsyncThunk(
    'search/searchBookmarkItems',
    async ({ userId, search }, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://movieapp-tu5n.onrender.com/user/searchbookmark', {
                userId,
                search
            });
            console.log(response.data.results);
            return response.data.results; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);


const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearchResults(state) {
            state.results = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchBookmarkItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchBookmarkItems.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload; 
            })
            .addCase(searchBookmarkItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Search failed';
            })
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

export const { clearSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
