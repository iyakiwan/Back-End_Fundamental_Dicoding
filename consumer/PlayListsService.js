const { Pool } = require('pg');

class PlayListsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlayLists(userId, playListId) {
    console.log(userId);
    console.log(playListId);
    const query = {
      text: `SELECT songs.id AS "id", songs.title AS "title", songs.performer AS "performer" 
      FROM songs
      INNER JOIN playlistsongs ON songs.id = playlistsongs.song_id
      INNER JOIN playlists ON playlists.id = playlistsongs.playlist_id
      LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
      WHERE playlistsongs.playlist_id = $1 AND (playlists.owner = $2 OR collaborations.user_id = $2)`,
      values: [playListId, userId],
    };
    const result = await this._pool.query(query);
    console.log(result.rows);
    return result.rows;
  }
}

module.exports = PlayListsService;
