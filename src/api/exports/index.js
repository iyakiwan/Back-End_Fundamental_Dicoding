const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { firstService, secondService, validator }) => {
    const exportsHandler = new ExportsHandler(firstService, secondService, validator);
    server.route(routes(exportsHandler));
  },
};
