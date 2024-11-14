import Order from "../models/Order.js"

export const createOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            shippingPrice,
            totalPrice,

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

export const updateOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id
        const order = await Order.findById(orderId)
        if (!order) {
            const error = new Error(`Order doesn't exists `)
            error.status = 401
            throw error
        }
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            updatedTime: req.body.updatedTime,
            emailAddress: req.body.emailAddress
        }

        const updatedOrder = await order.save()
        res.status(200).json({
            message: 'Order has been paid',
            updatedOrder
        })
    } catch (error) {
        console.log(error);
        if (!error.status) {
            error = new Error("Soemthign went wrong")
            error.status = 500
        }
        next(error)

    }
}

export const getorders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        }).sort({
            _id: -1
        })

        if (!orders) {
            const error = new Error('No orders found')
            error.status(400)
            throw error
        }

        res.status(200).json(orders)
    } catch (error) {
        if (!error.status) {
            error = new Error('Something went wrong')
            error.status = 500
        }
        next(error)
    }
}

export const getorder = async (req, res, next) => {
    try {
        const orderId = req.params.id
        const order = await Order.findById(orderId).populate("user", "email")

        if (!order) {
            const error = new Error('No order found')
            error.status(400)
            throw error
        }

        res.status(200).json(order)
    } catch (error) {
        if (!error.status) {
            error = new Error('Something went wrong')
            error.status = 500
        }
        next(error)
    }
}