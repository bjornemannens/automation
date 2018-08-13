const /*transmitter = require('./transmitter'),*/
  node = require('./Node/controller'),
  interval = require('./Interval/controller');

var sockets = [];

function sendIntervalsToAll(){
  interval.findAll(function(intervals){
    sockets.forEach(function(socket){
      socket.emit('intervals', {intervals: intervals});
    })
  })
}

function sendRemovedInterval(interval){
  const { _id } = interval;
  sockets.forEach(function(socket){
    socket.emit('removed interval', {_id: _id});
  })
}

function sendNewNode(node){
  sockets.forEach(function(socket){
    socket.emit('new node', {node: node});
  })
}

module.exports = function(io) {
    io.on('connection', function(socket) {
      sockets.push(socket);
      // Used in order to log incoming socket messages
      /*
      socket.use(function(msg, next){
        console.log(msg);
        next();
      });*/

      node.findAll(function(nodes){
        socket.emit('nodes', {nodes: nodes})
      });

      interval.findAll(function(intervals) {
        socket.emit('intervals', {intervals: intervals})
      })

      socket.on('disconnect', function() {
        console.log('user disconnected');
        //Remove the socket connection from the list
        var pos = sockets.socket;
        sockets.splice(pos, 1);

      });

      socket.on('node edit', node.edit(function(node) {
        sendNewNode(node);
      }));

      socket.on('interval create', interval.create(function(interval) {
        sendIntervalsToAll();
      }));

      socket.on('interval remove', interval.remove(function(interval) {
        sendRemovedInterval(interval);
      }));
    });
};
