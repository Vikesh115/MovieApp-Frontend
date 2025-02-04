import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    token: localStorage.getItem('token')||null,
    email: localStorage.getItem('email') || null,
    user: null, 
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://movieapp-tu5n.onrender.com/user/login', credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            return { token, user };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const getUser = createAsyncThunk(
    'auth/getUser',
    async (_, { getState, rejectWithValue }) => {
        const { token } = getState().auth;
        console.log('Token in getUser:', token);

        if (!token) {
            return rejectWithValue('Token is missing or invalid');
        }

        try {
            const response = await axios.get('https://movieapp-tu5n.onrender.com/user/getuser', {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.setItem('user', response.data.user._id); 
            localStorage.setItem('email', response.data.user.email);
            console.log('User data fetched:', response.data); 
            return response.data.user; 
        } catch (error) {
            console.error('Error fetching user data:', error); 
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null; 
            localStorage.removeItem('token'); 
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user; 
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; 
                state.email = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
