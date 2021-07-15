const { Pool } = require('pg');

class PlayListsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlayLists(userId, playListId) {
    const query = {
      text: `SELECT songs.id AS "id", songs.title AS "title", songs.performer AS "performer" 
      FROM songs
      INNER JOIN playlistsongs ON songs.id = playlistsongs.song_id
      INNER JOIN playlists ON playlists.id = playlistsongs.playlist_id
      WHERE playlistsongs.playlist_id = $1 OR playlists.owner = $2`,
      values: [playListId, userId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlayListsService;
