const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { firstService, secondService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      firstService, secondService, validator,
    );
    server.route(routes(collaborationsHandler));
  },
};
