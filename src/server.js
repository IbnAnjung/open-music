require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./apis/albums');
const AlbumService = require('./services/albums/AlbumService');
const AlbumValidator = require('./validators/albums/index');

const songs = require('./apis/songs');
const SongService = require('./services/songs/SongService');
const SongValidator = require('./validators/songs/index');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, h) => h.response({
        status: 'success',
        message: 'hello world',
      }),
    },
  ]);

  await server.register([
    {
      plugin: albums,
      options: {
        service: new AlbumService(),
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: new SongService(),
        validator: SongValidator,
      },
    },
  ]);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
