const express = require('express')

const router = express.Router()

const userController = require('../controllers/user.controller')
const verify = require('../middleware/auth').verifyToken

router.post('/startSession', userController.start_session)
router.post('/register', userController.registration)
router.post('/edit', verify, userController.user_edit)
router.post('/delete', verify, userController.user_delete)

module.exports = router
