import Product from '../models/Product.js';
import bcrypt from 'bcryptjs'

// Define individual functions
export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        const err = new Error("Something went wrong!")
        next(error || err)
    }
};
export const getProduct = async (req, res, next) => {
    try {
        const prodId = req.params.id
        const product = await Product.find({
            _id: prodId
        })
        if (!product) {
            return res.status(404).json({
                message: `Cannot find the product`
            })
        }

        res.status(200).json({
            message: 'Product fetched',
            product
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
};

export const createProduct = (req, res, next) => {};