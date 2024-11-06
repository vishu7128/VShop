import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit';
import api from '../utils/configureAxios.js'; // Import the axios instance

// Thunk for fetching products with error handling
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, {
    rejectWithValue
}) => {
    try {
        const response = await api.get('/products'); // Use the axios instance
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue("Failed to fetch products. Please try again.");
    }
});

// Thunk for fetching a single product by ID with error handling
export const fetchProductDetail = createAsyncThunk('products/fetchProductDetail', async (id, {
    rejectWithValue
}) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data.product;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue("Failed to fetch product details. Please try again.");
    }
});

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        product: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Use the custom error message from the server
            })
            .addCase(fetchProductDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Use the custom error message from the server
            });
    },
});

export default productsSlice.reducer;