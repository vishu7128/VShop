import Product from '../models/Product.js';
import bcrypt from 'bcryptjs'

// Define individual functions
export const getProducts = async (req, res, next) => {
    try {
        // Get the page and limit from the query parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

        // Calculate the number of products to skip (based on the page and limit)
        const skip = (page - 1) * limit;

        // Fetch products from the database with skip and limit
        const products = await Product.find().skip(skip).limit(limit);

        // Get the total count of products in the database for pagination purposes
        const totalCount = await Product.countDocuments();

        // Send the response with the products and pagination info
        res.status(200).json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
        });
    } catch (error) {
        const err = new Error("Something went wrong!");
        next(error || err);
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
            product: product[0]
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
};

export const createProduct = (req, res, next) => {};