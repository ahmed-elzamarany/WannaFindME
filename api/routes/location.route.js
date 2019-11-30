const express = require('express')

const router = express.Router()
const verify = require('../middleware/auth').verifyToken

const accountController = require('../controllers/location.controller')

router.post('/update', verify, accountController.update_location)
router.post('/view', verify, accountController.view_location)


module.exports = router
