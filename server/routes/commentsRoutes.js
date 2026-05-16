import express from 'express'
import { createComment, listComments } from '../controllers/commentsController.js'

const router = express.Router()

router.post('/', createComment)
router.get('/', listComments)

export default router
