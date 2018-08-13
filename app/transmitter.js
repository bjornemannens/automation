const Node = require('./Node/controller');
const Interval = require('./Interval/controller');
const Gpio = require ('onoff').Gpio;

const devicePins = [new Gpio(4, 'out')];

const updateNodeById = async (nodeId) => {
  Node.find(nodeId, function(node) {
    updateNode(node);
  });
}

function updateNode(node) {
  if (node.control){
    normalUpdate(node);
  } else {
    intervalUpdate(node);
  }
}

function normalUpdate(node) {
  devicePins[node.pin].writeSync(node.controlPower ? 1 : 0);
}

function intervalUpdate(node){
  Interval.findAll(function(intervals) {
    nodeIntervals = intervals.filter(i => i.nodeId == node._id);
    var time = getTime();
    var active = false;

    nodeIntervals.map(i => {
      if (i.start < i.end){
        if (time >= i.start && time < i.end)
          active = true;

      } else {
        if (time >= i.start || time >= i.end)
          active = true;
      }
    });
    devicePins[node.pin].writeSync(active ? 1 : 0);
  })
}


setInterval(function(){
  Node.findAll(function (nodes){
    nodes.map(n => {updateNode(n)});
  });
}, 60000)

function getTime() {
  let d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

module.exports = {
  updateNodeById
}
