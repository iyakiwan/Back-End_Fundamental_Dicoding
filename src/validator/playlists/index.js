const { PlayListPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlayListsValidator = {
  validatePlayListPayload: (payload) => {
    const validationResult = PlayListPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlayListsValidator;
