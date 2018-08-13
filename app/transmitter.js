const Node = require('./Node/controller');
const Interval = require('./Interval/controller');
const Gpio = require ('onoff').Gpio;

const devicePins = [new Gpio(4, 'out')];

const updateNode = async (nodeId) => {
  Node.find(nodeId, function(node) {
    if (node.control) {
      devicePins[node.pin].writeSync(node.controlPower ? 1 : 0);
    } else {
      Interval.findAll(function(intervals) {
        nodeIntervals = intervals.filter(i => i.nodeId == nodeId);
        var time = getTime();
        var active = false;
        nodeIntervals.map(i => {
          if (i.start < i.end){
            if (time > i.start && time > i.end)
              active = true;

          } else {
            if (time > i.start || time > i.end)
              active = true;
          }
        });
        devicePins[node.pin].writeSync(active ? 1 : 0);
      })
    }
  });
}

function getTime() {
  let d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

module.exports = {
  updateNode
}
