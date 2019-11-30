const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const errorCodes = require('../constants/errorCodes')

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const decoded = await jwt.verify((req.headers.authorization.split(' '))[1],
        keys.secret)
      if (decoded) {
        req.userId = decoded.userId
        req.username = decoded.username
      }
      return next()
    } catch (exception) {
      return res.status(401).json({
        error: {
          message: exception.message,
          statusCode: errorCodes.expiredToken
        }
      })
    }
  }
}
