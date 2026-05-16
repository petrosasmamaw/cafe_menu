import express from 'express'
import { createComment, listComments } from '../controllers/commentsController.js'

const router = express.Router()

router.get('/', listComments)
router.post('/', createComment)

export default router
