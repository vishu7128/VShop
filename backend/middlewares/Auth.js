import jwt from 'jsonwebtoken'
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
            req.user = await User.findById(decodedToken.id).select("-password")
            next()

        } catch (error) {
            next(error)
            console.log(error);
        }
    } else {
        res.status(401).json({
            message: 'Not Authorized'
        })
        // next(error)
    }
}