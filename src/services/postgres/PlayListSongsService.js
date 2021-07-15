const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlayListSongsService {
  constructor() {
    this._pool = new Pool();
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
  }

  async getPlayListSongs(playlistId) {
    const query = {
      text: `SELECT songs.id AS "id", songs.title AS "title", songs.performer AS "performer" 
      FROM songs
      INNER JOIN playlistsongs ON songs.id = playlistsongs.song_id
      WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlayListSongById(id) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('PlayListSong gagal dihapus. Id tidak ditemukan');
    }
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
