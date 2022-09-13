class AlbumsHandler {
  constructor(service, songService, validator) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(r, h) {
    try {
      this._validator.validateAlbumPayload(r.payload);

      const { name, year } = r.payload;
      const albumId = await this._service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode === undefined ? 500 : error.statusCode);
      return response;
    }
  }

  async getAlbumByIdHandler(r, h) {
    const { id } = r.params;
    try {
      const { name, year } = await this._service.getAlbumById(id);
      const songs = await this._songService.getSongsByAlbumId(id);

      return {
        status: 'success',
        data: {
          album: {
            id,
            name,
            year,
            songs: songs.map((song) => ({
              id: song.id,
              title: song.title,
              performer: song.performer,
            })),
          },
        },
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode === undefined ? 500 : error.statusCode);
      return response;
    }
  }

  async putAlbumByIdHandler(r, h) {
    try {
      this._validator.validateAlbumPayload(r.payload);
      const { id } = r.params;

      await this._service.editAlbumById(id, r.payload);

      return {
        status: 'success',
        message: 'Album berhasil diperbaharui',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode === undefined ? 500 : error.statusCode);
      return response;
    }
  }

  async deleteAlbumByIdHandler(r, h) {
    try {
      const { id } = r.params;

      await this._service.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album berhasil diperbaharui',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode === undefined ? 500 : error.statusCode);
      return response;
    }
  }
}

module.exports = AlbumsHandler;
