const Joi = require('joi')

const Follower = Joi.object().keys({
  userId: Joi.number().required(),
}).required()
const empty = Joi.object().keys({
}).required()
module.exports = {
  empty,
  Follower
}
