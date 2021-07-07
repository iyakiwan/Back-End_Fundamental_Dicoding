const Joi = require('joi');

const PlayListPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { PlayListPayloadSchema };
