import io from 'socket.io-client';

/**
 * Listening to page changes and dynamically changing site titles
 */
export default {
  install: (app, { connection, options }) => {
    const socket = io(connection, options);
    app.config.globalProperties.$socket = socket;
    app.provide('socket', socket);
  },
};
