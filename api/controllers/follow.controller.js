/* eslint-disable max-len */
const joi = require('joi')
const errorCodes = require('../constants/errorCodes')
const validations = require('../validations/follow.validation')
const User = require('../../models/user.model')

// exports.view_my_followers = async (req, res) => {
//   const request = req.body
//   const filterValidation = joi.validate(request, validations.empty)
//   if (filterValidation.error)
//     return res.status(400).json({
//       error: {
//         message: filterValidation.error.message,
//         code: errorCodes.validation
//       }
//     })

//   const { filter } = request
//   try {
//     let accounts = await Accounts.findAll()
//     if (filter) {
//       if (filter.emailFilter) {
//         accounts = account_filter_by_email(accounts, filter.emailFilter)
//       }

//       if (filter.numberFilter) {
//         accounts = account_filter_by_phone_number(accounts, filter.numberFilter)
//       }

//       if (filter.idFilter) {
//         if (filter.idFilter.after) {
//           accounts = accounts.filter(account => account.dataValues.userId >= filter.idFilter.after)
//         }

//         if (filter.idFilter.before) {
//           accounts = accounts.filter(account => account.dataValues.userId <= filter.idFilter.before)
//         }

//         if (filter.idFilter.between) {
//           if (filter.idFilter.between.firstId <= filter.idFilter.between.secondId)
//             accounts = accounts.filter(account => account.dataValues.userId >= filter.idFilter.between.firstId && account.dataValues.userId <= filter.idFilter.between.secondId)
//           else
//             accounts = accounts.filter(account => account.dataValues.userId <= filter.idFilter.between.firstId && account.dataValues.userId >= filter.idFilter.between.secondId)
//         }
//       }
//     }

//     return res.json({
//       Account: accounts,
//       filter
//     })
//   } catch (error) {
//     return res.send({
//       exception: {
//         message: "couldn't scan data",
//         statusCode: errorCodes.scanFailed,

//       }
//     })
//   }
// }

exports.view_all_users = async (req, res) => {
  const request = req.body
  const filterValidation = joi.validate(request, validations.empty)
  if (filterValidation.error)
    return res.status(400).json({
      error: {
        message: filterValidation.error.message,
        code: errorCodes.validation
      }
    })

  try {
    const data = await User.findAll({
      attributes: ['username', 'userId']
    })
    if (data.length < 1)
      throw new Error('no data matched')
    return res.json({
      data
    })
  } catch (error) {
    if (error.message === 'no data matched') {
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
          statusCode: errorCodes.scanFailed
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
exports.view_my_followers = async (req, res) => {
  const request = req.body
  const filterValidation = joi.validate(request, validations.empty)
  if (filterValidation.error)
    return res.status(400).json({
      error: {
        message: filterValidation.error.message,
        code: errorCodes.validation
      }
    })

  try {
    const data = await User.findAll({
      attributes: ['username', 'userId', 'following']
    })
    if (data.length < 1)
      throw new Error('no data matched')
    const users = []
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].dataValues.following.includes(req.userId))
        users.push(data[i].dataValues.username)
    }

    return res.json({
      users
    })
  } catch (error) {
    if (error.message === 'no data matched') {
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
          statusCode: errorCodes.scanFailed
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


exports.view_my_following = async (req, res) => {
  const data = req.body

  const validateData = joi.validate(data, validations.empty)

  if (validateData.error)
    return res.status(400).json({
      error: {
        statusCode: errorCodes.validation,
        message: validateData.error.message
      }
    })

  const { userId } = req

  try {
    const user = await User.findByPk(userId)
    if (user === null)
      throw new Error('failed to find user')

    const info = await User.findAll({
      attributes: ['username', 'userId'],
      where: {
        userId: user.dataValues.following
      }
    })
    return res.json({
      statusCode: 0,
      users: info
    })
  } catch (error) {
    if (error.message === 'failed to find user') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.notFound
        }
      })
    }
    if (error.errors[0].message) {
      return res.status(400).json({
        error: {
          message: error.errors[0].message,
          statusCode: errorCodes.getFollowingFailed
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
exports.add_follower = async (req, res) => {
  const data = req.body

  const validData = joi.validate(data, validations.Follower)
  if (validData.error) {
    return res.status(400).json({
      error: {
        message: validData.error.message,
        statusCode: errorCodes.validation
      }
    })
  }
  try {
    const { userId } = data

    const account = await User.findByPk(userId)
    if (account === null)
      throw new Error('failed to find account')

    const { following } = account.dataValues

    if (following.includes(req.userId))
      throw new Error('already following')

    following.push(req.userId)
    const updatedData = await account.update({ following })

    if (updatedData === null)
      throw new Error('failed to add follower')

    return res.json({
      data: {
        statusCode: 0,
      }
    })
  }


  catch (error) {
    if (error.message === 'already following') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.repeated
        }
      })
    }
    if (error.message === 'failed to find account') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.getFailed
        }
      })
    }

    if (error.message === 'failed to add follower') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.addFollower
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
exports.delete_follower = async (req, res) => {
  const data = req.body
  const validData = joi.validate(data, validations.Follower)
  if (validData.error) {
    return res.status(400).json({
      error: {
        message: validData.error.message,
        statusCode: errorCodes.validation
      }
    })
  }
  const { userId } = data

  try {
    const account = await User.findByPk(userId)
    if (account === null)
      throw new Error('failed to find user')

    let { following } = account.dataValues

    if (!following.includes(req.userId))
      throw new Error('he is not following you')

    following = following.filter((value) => value !== req.userId)
    const updatedData = await account.update({ following })

    if (updatedData === null)
      throw new Error('failed to remove follower')
    return res.json({
      data: {
        statusCode: 0
      }

    })
  } catch (error) {
    if (error.message === 'failed to remove follower') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.removeFollowerFailed
        }
      })
    }
    if (error.message === 'he is not following you') {
      return res.status(400).json({
        error: {
          message: error.message,
          statusCode: errorCodes.repeated
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
