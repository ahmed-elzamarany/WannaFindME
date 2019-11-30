/* eslint-disable max-len */
const joi = require('joi')
const errorCodes = require('../constants/errorCodes')
const validations = require('../validations/location.validation')
const User = require('../../models/user.model')

exports.update_location = async (req, res) => {
  const data = req.body
  const validData = joi.validate(data, validations.locationUpdate)
  if (validData.error) {
    return res.status(400).json({
      error: {
        message: validData.error.message,
        statusCode: errorCodes.accountValidationFailed
      }
    })
  }

  const { userId } = req

  try {
    const user = await User.findByPk(userId)
    if (user === null)
      throw new Error('failed to find user')

    const location = await user.update(data.location)
    if (location === null)
      throw new Error('failed to update location')

    return res.json({
      data: {
        statusCode: 0,
        Account: {
          userId
        }
      }
    })
  }
  catch (error) {
    if (error.message === 'failed to find user') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.getFailed
        }
      })
    }
    if (error.message === 'failed to update location') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.locationUpdateFailed
        }
      })
    }
    return res.status(400).json({
      error: {
        message: error.message,
        statusCode: errorCodes.unknown
      }
    })
  }
}


exports.view_location = async (req, res) => {
  const validData = joi.validate(req.body, validations.locationView)
  if (validData.error) {
    return res.status(400).json({
      error: {
        message: validData.error.message,
        statusCode: errorCodes.accountValidationFailed
      }
    })
  }
  const { userId } = req.body


  try {
    const account = await User.findByPk(userId)
    if (account === null)
      throw new Error('failed to find user')


    return res.json({
      data: {
        statusCode: 0
      },
      longitude: account.dataValues.longitude,
      latitude: account.dataValues.latitude
    })
  } catch (error) {
    if (error.message === 'failed to find user') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.getFailed
        }
      })
    }
    if (error.errors[0].message) {
      return res.status(400).json({
        error: {
          message: error.errors[0].message,
          statusCode: errorCodes.locationViewFailed
        }
      })
    }
    return res.status(400).json({
      error: {
        message: error.message,
        statusCode: errorCodes.unknown
      }
    })
  }
}
