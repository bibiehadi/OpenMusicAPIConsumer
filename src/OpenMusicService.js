const { Pool } = require('pg');

class OpenMusicService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylistById(playlistId, userId) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username  FROM playlists
             LEFT JOIN users ON playlists.owner = users.id
             LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
             WHERE playlists.id = $1 AND ( playlists.owner = $2 OR collaborations.user_id = $2)
             GROUP BY playlists.id, playlists.name, users.username
            `,
            values: [playlistId, userId],
        };
        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async getSongsByPlaylistId(playlistId) {
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer FROM songs 
        LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            return [];
        }
        return result.rows;
    }
}

module.exports = OpenMusicService;

