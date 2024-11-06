import express from 'express'
import {
    protect
} from '../middlewares/Auth.js'

const router = express.Router()

router.get('/paypal', protect, (req, res, next) => {
    res.status(200).json({
        clientId: process.env.PAYPAL_CLIENTID
    })
})

export default router