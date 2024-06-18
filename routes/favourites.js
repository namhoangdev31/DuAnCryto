import { Router } from 'express'
const router = Router()
import { addFavourite, removeFavourite } from '../controllers/favourites.js'
import { authByToken } from '../middleware/auth.js'

router.post('/:slug/favorite',authByToken,addFavourite)         //Favorite an article
router.delete('/:slug/favorite',authByToken,removeFavourite)    //Unfavorite an article

export default router