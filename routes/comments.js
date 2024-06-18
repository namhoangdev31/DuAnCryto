import { Router } from 'express'
const router = Router()
import { getAllComments, postNewComment, deleteComment } from '../controllers/comments.js'
import { authByToken } from '../middleware/auth.js'

router.get('/:slug/comments',getAllComments)                      //Get the comments for an article. 
router.post('/:slug/comments',authByToken,postNewComment)         //Create a comment for an article. 
router.delete('/:slug/comments/:id',authByToken,deleteComment)    //Delete a comment for an article.

export default router