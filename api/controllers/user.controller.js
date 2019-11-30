const joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const errorCodes = require('../constants/errorCodes')
const validations = require('../validations/user.validation')
const User = require('../../models/user.model')
const { secret } = require('../../config/keys')

exports.registration = async (req, res) => {
  const request = req.body
  const validData = joi.validate(request, validations.userRegister)
  if (validData.error) {
    return res.status(400).json({
      error: {
        message: validData.error.message,
        statusCode: errorCodes.validation
      }
    })
  }
  const data = request.user
  const { username } = data
  const { password } = data
  const hashedPassword = bcrypt.hashSync(password, 10)

  try {
    const Item = {
      username,
      password: hashedPassword,
    }


    const user = await User.create(Item)
    return res.json({
      data: {
        statusCode: 0,
        User: {
          id: user.dataValues.userId // id value

        }
      }
    })
  }
  catch (error) {
    if (error.errors[0].message) {
      return res.status(400).json({
        error: {
          message: error.errors[0].message,
          statusCode: errorCodes.userCreationFailed
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

exports.start_session = async (req, res) => {
  const request = req.body
  const validData = joi.validate(request, validations.userLogin)
  if (validData.error) {
    return res.status(400).json({
      error: {
        message: validData.error.message,
        statusCode: errorCodes.validation
      }
    })
  }
  const data = request.user
  const { username } = data
  const { password } = data
  let user

  try {
    user = await User.findOne({ where: { username } })
    if (user === null)
      throw new Error('user does not exist')
    if (bcrypt.compareSync(password, user.dataValues.password)) {
      const expirationDate = Math.floor(Date.now() / 1000) + 14400; // 4 hours from now...
      const { userId } = user.dataValues
      const token = jwt.sign({ username, userId, exp: expirationDate }, secret)

      return res.json({
        User: {
          token
        }
      })
    }

    throw new Error('password is incorrect')
  }

  catch (error) {
    if (error.message === 'user does not exist') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.getFailed
        }
      })
    }
    if (error.message === 'password is incorrect') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.validation
        }
      })
    }

    if (error.errors) {
      return res.status(400).json({
        error: {
          message: error.errors[0].message,
          statusCode: errorCodes.userCreationFailed
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


exports.user_edit = async (req, res) => {
  const data = req.body

  const validData = joi.validate(data, validations.userEdit)
  if (validData.error) {
    return res.status(400).json({
      error: {
        message: validData.error.message,
        statusCode: errorCodes.validation
      }
    })
  }
  try {
    const { userId } = req
    // if (req.userId !== id)
    //   throw new Error('authorization error, you are not allowed to do this action')

    const fields = []
    let password = ''
    if (data.user.username) {
      fields.push('username')
    }

    if (data.user.password) {
      fields.push('password')
      password = bcrypt.hashSync(data.user.password, 10)
    }
    const params = { username: data.user.username, password }

    const account = await User.findByPk(userId)
    if (account === null)
      throw new Error('failed to find user')
    const updatedData = await account.update(params, { fields })
    if (updatedData === null)
      throw new Error('failed to update user')
    return res.json({
      data: {
        statusCode: 0,
        User: {
          userId
        },
        userName: updatedData.dataValues.username
      }
    })
  }


  catch (error) {
    if (error.message === 'failed to update user') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.userCreationFailed
        }
      })
    }


    if (error.message === 'failed to find user') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.getFailed
        }
      })
    }
    if (error.errors) {
      return res.status(400).json({
        error: {
          message: error.errors[0].message,
          statusCode: errorCodes.userCreationFailed
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

exports.user_delete = async (req, res) => {
  const data = req.body
  const validData = joi.validate(data, validations.deleteuser)
  if (validData.error) {
    return res.status(400).json({
      error: {
        message: validData.error.message,
        statusCode: errorCodes.validation
      }
    })
  }
  const { userId } = req

  try {
    // if (req.userId !== id)
    //   throw new Error('authorization error, you are not allowed to do this action')

    const info = await User.findByPk(userId)
    if (info === null)
      throw new Error('failed to find user')

    await info.destroy()
    return res.json({
      data: {
        statusCode: 0
      }

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
          statusCode: errorCodes.userDeleteFailed
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
