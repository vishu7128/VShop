import {
    createAsyncThunk,
    createSlice
} from "@reduxjs/toolkit";
import api from "../utils/configureAxios";

// Thunk to create a new order
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, {
        rejectWithValue
    }) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Error creating order.");
        }
    }
);

// Thunk to fetch order details by ID
export const getOrderDetails = createAsyncThunk(
    'order/getOrderDetails',
    async (orderId, {
        rejectWithValue
    }) => {
        try {
            const response = await api.get(`/orders/$ {orderId}`)
            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Error fetching order details.");
        }
    }
);

// Thunk to fetch list of orders
export const getOrderList = createAsyncThunk(
    'order/getOrderList',
    async (_, {
        rejectWithValue
    }) => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Error fetching orders list.");
        }
    }
);

// Thunk to update payment status of an order
export const updatePaymentStatus = createAsyncThunk(
    'order/updatePaymentStatus',
    async ({
        orderId,
        paymentResult
    }, {
        rejectWithValue
    }) => {
        try {
            const response = await api.put(`/orders/${orderId}/payment`, {
                paymentResult
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Error updating payment status.");
        }
    }
);


const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        orderDetails: null,
        shippingAddress: null,
        orderCreationStatus: null,
        paymentUpdateStatus: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearOrderState: (state, action) => {
            state.orders = [];
            state.orderDetails = null;
            state.shippingAddress = null;
            state.orderCreationStatus = null;
            state.paymentUpdateStatus = null;
            state.loading = false;
            state.error = null;
            if (action.payload && action.payload.forceAddressClear)
                localStorage.removeItem("shippingAddresses");
        },
        saveShippingAddress: (state, action) => {
            const {
                userId,
                shippingAddress
            } = action.payload;
            const addresses = JSON.parse(localStorage.getItem("shippingAddresses")) || {};
            addresses[userId] = shippingAddress;
            localStorage.setItem("shippingAddresses", JSON.stringify(addresses));
            state.shippingAddress = shippingAddress;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle createOrder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderCreationStatus = null;
            })
            .addCase(createOrder.fulfilled, (state) => {
                state.loading = false;
                state.orderCreationStatus = "success";
                // state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.orderCreationStatus = "failed";
                state.error = action.payload;
            })

            // Handle getOrderDetails
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getOrderList
            .addCase(getOrderList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderList.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getOrderList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle updatePaymentStatus
            .addCase(updatePaymentStatus.pending, (state) => {
                state.loading = true;
                state.paymentUpdateStatus = null;
                state.error = null;
            })
            .addCase(updatePaymentStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentUpdateStatus = "success";
                if (state.orderDetails && state.orderDetails._id === action.payload._id) {
                    state.orderDetails.isPaid = true;
                    state.orderDetails.paymentResult = action.payload.paymentResult;
                }
            })
            .addCase(updatePaymentStatus.rejected, (state, action) => {
                state.loading = false;
                state.paymentUpdateStatus = "failed";
                state.error = action.payload;
            });
    },
});

export const {
    clearOrderState,
    saveShippingAddress
} = orderSlice.actions;
export default orderSlice.reducer;