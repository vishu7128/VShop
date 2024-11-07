import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import {
    generateToken
} from '../tokenGenerate.js';



export const registerUser = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(401).json({
                message: `Enough data not provided`
            });
        }

        const isEmailExists = await User.findOne({
            email
        });
        if (isEmailExists) {
            return res.status(401).json({
                message: `Email already exists`
            });
        }

        // Hashing the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: `User created Successfully`,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({
            message: `Something went wrong`
        });
    }
};


export const loginUser = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(401).json({
                message: "User doesn't exist"
            });
        }

        const userIsValid = await user.matchPassword(password);
        if (!userIsValid) return res.status(401).json({
            message: "Bad password"
        });

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            token: generateToken(user._id)
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "An error occurred during login. Please try again later."
        });
    }
};


export const getUserProfile = async (req, res, next) => {
    try {
        const id = req.user._id
        const user = await User.findById(id)
        if (!user) res.status(400).json({
            message: `User not found`
        })

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
        });

    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        const id = req.user._id

        const user = await User.findById(id)
        if (!user) return res.status(401).json({
            message: 'User not found'
        })

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) user.password = req.body.password

        const updatedUser = await user.save()

        return res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            createdAt: updatedUser.createdAt,
        });

    } catch (error) {
        console.log(error);
        next(error)
    }
}