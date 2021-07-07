const PlayListsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playListsHandler = new PlayListsHandler(service, validator);
    server.route(routes(playListsHandler));
  },
};
