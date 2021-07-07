const { PlayListSongPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlayListSongsValidator = {
  validatePlayListSongPayload: (payload) => {
    const validationResult = PlayListSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlayListSongsValidator;
