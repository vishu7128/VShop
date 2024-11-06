import mongoose from "mongoose";


const orderItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
})

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    paymentMethod: {
        type: String,
        default: "Paypal",
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paymentResult: {
        id: {
            type: String
        },
        staus: {
            type: String
        },
        updatedTime: {
            type: String
        },
        emailAddress: {
            type: String
        }
    },
    isDelievered: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema)

export default Order