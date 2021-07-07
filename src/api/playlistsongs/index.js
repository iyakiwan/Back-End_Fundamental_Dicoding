const PlayListSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (server, { firstService, secondService, validator }) => {
    const playListSongsHandler = new PlayListSongsHandler(
      firstService, secondService, validator,
    );
    server.route(routes(playListSongsHandler));
  },
};
