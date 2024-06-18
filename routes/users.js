import { Router } from 'express'
const router = Router()
import { createUser, loginUser, getUserByEmail, updateUserDetails } from '../controllers/users.js'
import { authByToken } from '../middleware/auth.js'

router.post('/users',createUser)                     //Register a new user
router.post('/users/login',loginUser)                //Login for existing user
router.get('/user',authByToken,getUserByEmail)       //Gets the currently logged-in user
router.patch('/user',authByToken,updateUserDetails)  //Updated user information for current user

export default router