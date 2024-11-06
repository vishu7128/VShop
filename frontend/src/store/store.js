import {
    configureStore
} from '@reduxjs/toolkit';
import productReducer from './productsSlice.js';
import authReducer from './authSlice.js';
import cartReducer from './cartSlice.js'
import orderSlice from './orderSlice.js'

const store = configureStore({
    reducer: {
        products: productReducer,
        auth: authReducer,
        cart: cartReducer,
        order: orderSlice
    },
});

export default store;