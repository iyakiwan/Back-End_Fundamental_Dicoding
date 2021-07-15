const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportPlayListsHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];

module.exports = routes;
