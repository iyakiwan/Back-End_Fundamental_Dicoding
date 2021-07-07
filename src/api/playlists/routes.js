const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlayListHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlayListsHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playListId}',
    handler: handler.deletePlayListByIdHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];

module.exports = routes;
