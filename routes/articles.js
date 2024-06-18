import { Router } from 'express'
const router = Router()

import { authByToken } from '../middleware/auth.js'

import { getAllArticles, getFeed, createArticle, getSingleArticleBySlug, updateArticle, deleteArticle } from '../controllers/articles.js'

router.get('/',getAllArticles)                    //Get most recent articles from users you follow
router.get('/feed',authByToken,getFeed)           //Get most recent articles globally
router.post('/',authByToken,createArticle)        //Create an article
router.get('/:slug',getSingleArticleBySlug)       //Get an article
router.patch('/:slug',authByToken,updateArticle)  //Update an article 
router.delete('/:slug',authByToken,deleteArticle) //Delete an article

export default router