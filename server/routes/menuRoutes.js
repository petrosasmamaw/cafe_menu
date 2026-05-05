import express from 'express'
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getMenu)
router.post('/', requireAuth, addMenuItem)
router.put('/:id', requireAuth, updateMenuItem)
router.delete('/:id', requireAuth, deleteMenuItem)

export default router
