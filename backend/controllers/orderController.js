import Order from "../models/Order.js"

export const createOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            shippingPrice,
            totalPrice,
            price

        } = req.body

        if (orderItems && orderItems.length === 0) {
            res.status(400)
            throw new Error("No order items found")
        }

        const order = await Order.create({
            orderItems,
            shippingAddress,
            paymentMethod,
            shippingPrice,
            totalPrice,
            price,
            user: req.user._id
        })

        return res.status(201).json({
            order
        })

    } catch (error) {
        console.log(error);
        if (!error.status) {
            error = new Error("Something went wrong")
            error.status = 500
        }
        next(error)
    }
}