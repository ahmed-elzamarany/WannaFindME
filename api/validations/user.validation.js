const Joi = require('joi')

const userRegister = Joi.object().keys({
  user: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required()
})

const userLogin = Joi.object().keys({
  user: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
  }).required()
})

const userEdit = Joi.object().keys({
  user: Joi.object().keys({
    username: Joi.string().optional(),
    password: Joi.string().optional()
  }).min(1).required()
})

const deleteuser = Joi.object().keys({}).required()

module.exports = {
  deleteuser,
  userRegister,
  userLogin,
  userEdit }
