const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema } = require('./schema');

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResults = SongPayloadSchema.validate(payload);
    if (validationResults.error) {
      throw new InvariantError(validationResults.error.message);
    }
  },
};

module.exports = SongValidator;
