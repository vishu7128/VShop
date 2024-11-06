import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors'
import userRouter from "./routes/userRoutes.js"; // Import userRoutes
import productRouter from "./routes/productRoutes.js"; // Import userRoutes
import orderRouter from "./routes/orderRoutes.js"; // Import orderRoutes
import paypalRouter from "./routes/paypalRoutes.js"; // Import orderRoutes


const app = express();
app.use(cors());
dotenv.config(); // Use dotenv config method to load environment variables
const PORT = process.env.PORT || 7000; // Set a default value for PORT


app.use(express.json());
app.use('/users', userRouter); // User Routes
app.use('/products', productRouter); // Product Routes
app.use('/orders', orderRouter); // Order Routes
app.use('/api/config', paypalRouter); // Order Routes

// Error handling middleware
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const {
        message
    } = error;

    res.status(statusCode).json({
        message: message
    });
});

// connect to db
mongoose.connect(process.env.MONGODB_URL).then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(err => {
    console.error("Failed to connect db:", err);
});