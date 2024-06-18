import { Router } from 'express';
const router = Router();
import { getFollowers, follow, unfollow } from '../controllers/profile.js';

import { authByToken } from '../middleware/auth.js';

router.get('/:username',authByToken,getFollowers)         //Get a profile of a user of the system
router.post('/:username/follow',authByToken,follow)       //Follow a user by username
router.delete('/:username/follow',authByToken,unfollow)   //Unfollow a user by username

export default router