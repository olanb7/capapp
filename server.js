var io = require('socket.io').listen(4001);

var conf = 0, resp = 0, bp = 0, age = 0, urea = 0, obj;

io.sockets.on('connection', function (socket) {
  console.log('connected...');

  socket.emit('initial', [conf, urea, resp, bp, age]);

  socket.on('score', function (data) {
    conf += data.confusion;
    urea += data.urea;
    resp += data.respiratory;
    bp += data.bp;
    age += data.age;

    socket.broadcast.emit('updates', [conf, urea, resp, bp, age]);
  });

});