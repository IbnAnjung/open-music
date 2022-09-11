require('dotenv').config();

const Hapi = require('@hapi/hapi');

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
      handler: (request, h) => {
        return h.response({
          status: 'success',
          message: 'hello world',
        });
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
