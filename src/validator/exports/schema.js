const Joi = require('joi');

const ExportPlayListsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportPlayListsPayloadSchema;
