/* eslint-disable camelcase */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlayListSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addPlayListSong({ playlistId, songId }) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke PlayList');
    }

    await this._cacheService.delete(`playlistsongs:${playlistId}`);
  }

  async getPlayListSongs(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistsongs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id AS "id", songs.title AS "title", songs.performer AS "performer" 
        FROM songs
        INNER JOIN playlistsongs ON songs.id = playlistsongs.song_id
        WHERE playlistsongs.playlist_id = $1`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`playlistsongs:${playlistId}`, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async deletePlayListSongById(id) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE id = $1 RETURNING id, playlist_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('PlayListSong gagal dihapus. Id tidak ditemukan');
    }

    const { playlist_id } = result.rows[0];
    await this._cacheService.delete(`playlistsongs:${playlist_id}`);
  }

  async verifyPlayListSong(playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('PlayListSong gagal diverifikasi');
    }

    return result.rows[0].id;
  }
}

module.exports = PlayListSongsService;
