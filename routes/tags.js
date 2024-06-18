import { Router } from 'express'
const router = Router()
import { getAllTags } from '../controllers/tags.js'

router.get('/',getAllTags)     //Get all tags

export default router