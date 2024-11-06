import express from 'express'
import {
    createOrder,
    updateOrder,
    getorders,
    getorder
}
from '../controllers/orderController.js'
import {
    protect
} from '../middlewares/Auth.js'

const router = express.Router()

router.post('/', protect, createOrder)
router.put('/:id/payment', protect, updateOrder)
router.get('/', protect, getorders)
router.get('/:id', protect, getorder)

export default router