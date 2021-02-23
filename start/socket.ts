import SocketIO from '@ioc:Socket.IO';
SocketIO.afterStart(() => {
  const io = SocketIO.io();
  io.on('connection', function (socket) {
    console.log(socket.id);
  });
});
