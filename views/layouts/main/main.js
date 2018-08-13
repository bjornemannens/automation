var socket = io();

socket.on('nodes', function(msg) {
  const { nodes } = msg;
  vue._data.nodes = nodes;
});

socket.on('new node', function(msg) {
  const { node } = msg;
  let nodes = vue._data.nodes;
  vue._data.nodes = nodes.map(n => n._id == node._id ? node : n);
})

socket.on('intervals', function(msg) {
  const { intervals } = msg;
  vue._data.intervals = intervals;
});

socket.on('removed interval', function (msg) {
  const { _id } = msg;
  let intervals = vue._data.intervals;
  vue._data.intervals = intervals.filter(interval => interval._id != _id);
})

function sendNode(node, toggle) {
  socket.emit('node edit', {node: node});
}

function sendCreateInterval(interval) {
  socket.emit('interval create',{interval: interval});

}

function sendRemoveInterval(interval) {
  socket.emit('interval remove', {interval: interval});
}
