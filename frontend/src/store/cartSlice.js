import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";
import api from "../utils/configureAxios";

// Add to Cart action that fetches product details by ID
export const addToCart = createAsyncThunk(
    'products/addToCart',
    async ({
        id,
        quantity
    }, {
        rejectWithValue
    }) => { // Adjusted parameters
        try {
            const response = await api.get(`products/${id}`);
            return {
                product: response.data.product,
                quantity
            };
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Error fetching product details.");
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'products/removeFromCart',
    async (id, {
        rejectWithValue
    }) => {
        try {
            const response = await api.get(`products/${id}`);
            return response.data.product;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Error fetching product details.");
        }
    }
);

const cartFromLocalStorage = JSON.parse(localStorage.getItem("cartItems"));

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: cartFromLocalStorage || [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
            state.loading = false;
            state.error = null;
            localStorage.removeItem('cartItems');
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                const {
                    product,
                    quantity
                } = action.payload;
                // Check if item already exists in the cart
                const existingItem = state.cartItems.find(item => item._id === product._id);
                if (existingItem) {
                    // If item exists, increase the quantity by the specified amount
                    existingItem.quantity += quantity;
                } else {
                    // If item does not exist, add it with the specified quantity
                    state.cartItems.push({
                        ...product,
                        quantity
                    });
                }
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                const existingItem = state.cartItems.find(item => item._id === action.payload._id);
                if (existingItem) {
                    if (existingItem.quantity > 1) {
                        existingItem.quantity -= 1;
                    } else {
                        state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
                    }
                }
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;