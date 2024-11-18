import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit';
import api from '../utils/configureAxios.js'; // Import the axios instance

// Thunk to fetch products with pagination
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({
        page,
        limit
    }, {
        rejectWithValue
    }) => {
        try {
            // Add page and limit as query parameters to the API request
            const response = await api.get('/products', {
                params: {
                    page, // Current page
                    limit, // Number of products per page
                },
            });

            return response.data; // Return the data fetched from the API
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message); // Error message from server
            }
            return rejectWithValue("Failed to fetch products. Please try again.");
        }
    }
);

// Thunk for fetching a single product by ID with error handling
export const fetchProductDetail = createAsyncThunk(
    'products/fetchProductDetail',
    async (id, {
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
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [], // Store all products (appended with new ones on scroll)
        product: {}, // Store a single product's details
        currentPage: 1, // Track current page for pagination
        totalPages: 0, // Total number of pages from the API
        totalCount: 0, // Total count of products (not strictly necessary but useful)
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
                // Append newly fetched products to the existing list
                state.products = [...state.products, ...action.payload.products];
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.totalCount = action.payload.totalCount; // Optionally track total count
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