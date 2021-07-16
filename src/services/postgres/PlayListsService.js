const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlayListsService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async addPlayList({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('PlayList gagal ditambahkan');
    }

    await this._cacheService.delete(`playlists:${owner}`);
    return result.rows[0].id;
  }

  async getPlayLists(userId) {
    try {
      const result = await this._cacheService.get(`playlists:${userId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT playlists.id AS "id", playlists.name AS "name", users.username AS "username" 
        FROM playlists
        INNER JOIN users ON playlists.owner = users.id
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
        values: [userId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`playlists:${userId}`, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async deletePlayListById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id, owner',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('PlayList gagal dihapus. Id tidak ditemukan');
    }

    const { owner } = result.rows[0];
    await this._cacheService.delete(`playlists:${owner}`);
  }

  async verifyPlayListOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('PlayList tidak ditemukan');
    }
    const playList = result.rows[0];
    if (playList.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlayListAccess(playListId, userId) {
    try {
      await this.verifyPlayListOwner(playListId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playListId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlayListsService;
