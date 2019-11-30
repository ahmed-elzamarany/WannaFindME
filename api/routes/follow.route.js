const express = require('express')
const notifyController = require('../controllers/follow.controller')

const router = express.Router()
const verify = require('../middleware/auth').verifyToken

router.post('/add', verify, notifyController.add_follower)
router.post('/delete', verify, notifyController.delete_follower)
router.post('/scan', verify, notifyController.view_all_users)
router.post('/viewFollowing', verify, notifyController.view_my_following)
router.post('/viewFollowers', verify, notifyController.view_my_followers)


module.exports = router
