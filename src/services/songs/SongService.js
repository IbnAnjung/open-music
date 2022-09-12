const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongServier {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updateAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [`song-${id}`, title, year, genre, performer, duration, albumId, createdAt, updateAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows;
  }

  async getSongById(id) {
    const result = await this._pool.query({
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    });

    if (!(await result).rows.length) {
      throw new NotFoundError('Songs tidak ditemnukan');
    }

    return result.rows[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration = null, albumId = null,
  }) {
    const updateAt = new Date().toISOString();
    const result = await this._pool.query({
      text: ` UPDATE songs SET 
                title = $1, 
                year = $2,
                genre = $3,
                performer = $4,
                duration = $5,
                album_id = $6,
                updated_at = $7
                WHERE id = $8
                RETURNING id
            `,
      values: [title, year, genre, performer, duration, albumId, updateAt, id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbaharui Song, Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const result = await this._pool.query({
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus, id tidak ditemukan');
    }
  }

  async getSongsByAlbumId(albumId) {
    const result = await this._pool.query({
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [albumId],
    });

    return result.rows;
  }
}

module.exports = SongServier;
