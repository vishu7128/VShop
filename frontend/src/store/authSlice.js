import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import api from "../utils/configureAxios";

// Login action that takes email and password
export const login = createAsyncThunk('users/login', async ({
    email,
    password
}, {
    rejectWithValue
}) => {
    try {
        const response = await api.post('/users/login', {
            email,
            password
        });
        return response.data; // Assuming the API returns user data with a token
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue("Login failed. Please try again.");
    }
});

// Register action that takes email, name, and password
export const register = createAsyncThunk('users/register', async ({
    email,
    name,
    password
}, {
    rejectWithValue
}) => {
    try {
        const response = await api.post('/users/register', {
            email,
            name,
            password
        });
        return response.data.user; // Assuming the API returns the created user data
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue("Registration failed. Please try again.");
    }
});

// Load user data from localStorage if it exists
const userFromLocalStorage = JSON.parse(localStorage.getItem("userInfo"));

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: userFromLocalStorage || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userInfo'); // Remove user info and token
            state.user = null; // Reset the user to null
            state.loading = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null; // Reset the error to null
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
                state.user = action.payload;
                // Save user info with token to localStorage
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set the error message from the server
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Save user data on registration
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set the error message from the server
            });
    },
});

// Export the action creator for clearing the error
export const {
    clearError,
    logout
} = authSlice.actions;

export default authSlice.reducer;