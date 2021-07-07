const Joi = require('joi');

const PlayListSongPayloadSchema = Joi.object({
  songId: Joi.string().max(50).required(),
});

module.exports = { PlayListSongPayloadSchema };
