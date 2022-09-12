class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(r, h) {
    try {
      this._validator.validateSongPayload(r.payload);

      const songId = await this._service.addSong(r.payload);

      const res = h.response({
        status: 'success',
        data: {
          songId,
        },
      });
      res.code(201);
      return res;
    } catch (e) {
      const res = h.response({
        status: 'fail',
        message: e.message,
      });
      res.code(e.statusCode === undefined ? 500 : e.statusCode);
      return res;
    }
  }

  async getSongsHandler(r, h) {
    try {
      const songs = await this._service.getSongs(r.query);
      const res = h.response({
        status: 'success',
        data: {
          songs: songs.map(({ id, title, performer }) => ({
            id, title, performer,
          })),
        },
      });
      return res;
    } catch (e) {
      const res = h.response({
        status: 'fail',
        message: e.message,
      });
      res.code(500);
      return res;
    }
  }

  async getSongByIdHandler(r, h) {
    try {
      const { id } = r.params;
      const {
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
      } = await this._service.getSongById(id);

      const res = h.response({
        status: 'success',
        data: {
          song: {
            id,
            title,
            year,
            performer,
            genre,
            duration,
            albumId,
          },
        },
      });
      return res;
    } catch (error) {
      const res = h.response({
        status: 'fail',
        message: error.message,
      });
      res.code(error.statusCode === undefined ? 500 : error.statusCode);
      return res;
    }
  }

  async putSongByIdHandler(r, h) {
    try {
      this._validator.validateSongPayload(r.payload);
      const { id } = r.params;
      await this._service.editSongById(id, r.payload);
      return h.response({
        status: 'success',
        message: 'berhasil mengubah song',
      });
    } catch (error) {
      const res = h.response({
        status: 'fail',
        message: error.message,
      });
      res.code(error.statusCode === undefined ? 500 : error.statusCode);
      return res;
    }
  }

  async deleteSongByIdHandler(r, h) {
    try {
      const { id } = r.params;
      await this._service.deleteSongById(id, r.payload);
      return h.response({
        status: 'success',
        message: 'berhasil menghapus song',
      });
    } catch (error) {
      const res = h.response({
        status: 'fail',
        message: error.message,
      });
      res.code(error.statusCode === undefined ? 500 : error.statusCode);
      return res;
    }
  }
}

module.exports = SongHandler;
