const Joi = require('joi')

const locationUpdate = Joi.object().keys({

  location: Joi.object().keys({
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  }).required(),

}).required()

const locationView = Joi.object().keys({
  userId: Joi.number().required(),
}).required()
module.exports = {
  locationView,
  locationUpdate
}
