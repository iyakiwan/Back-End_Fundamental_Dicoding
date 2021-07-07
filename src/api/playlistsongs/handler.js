const ClientError = require('../../exceptions/ClientError');

class PlayListSongsHandler {
  constructor(firstService, secondService, validator) {
    this._servicePlayListSong = firstService;
    this._servicePlayList = secondService;
    this._validator = validator;

    this.postPlayListSongHandler = this.postPlayListSongHandler.bind(this);
    this.getPlayListSongsHandler = this.getPlayListSongsHandler.bind(this);
    this.deletePlayListSongByIdHandler = this.deletePlayListSongByIdHandler.bind(this);
  }

  async postPlayListSongHandler(request, h) {
    try {
      this._validator.validatePlayListSongPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const { songId } = request.payload;

      await this._servicePlayList.verifyPlayListOwner(playlistId, credentialId);
      await this._servicePlayListSong.addPlayListSong({ playlistId, songId });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlayListSongsHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._servicePlayList.verifyPlayListOwner(playlistId, credentialId);
      const songs = await this._servicePlayListSong.getPlayListSongs(playlistId);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlayListSongByIdHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._servicePlayList.verifyPlayListOwner(playlistId, credentialId);
      const id = await this._servicePlayListSong.verifyPlayListSong(playlistId, songId);
      await this._servicePlayListSong.deletePlayListSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlayListSongsHandler;
