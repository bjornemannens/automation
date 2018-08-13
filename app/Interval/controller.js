const repository = require( "./repository" );

module.exports.create = function(callback) {
  return async ( data ) => {
    const { interval } = data;
    repository.findIntervals().then(({data,headers,status}) => {
      intervals = data;
      let exists = false;
      data.rows.forEach(function(item) {
        if (item.nodeId == interval.nodeId &&
          item.start == interval.start &&
          item.end == interval.end) {
            exists = true;
        };
      });

      if (!exists) {
        interval.type = "interval"
        repository.saveInterval(interval).then(({data,headers,status}) => {
          callback(interval);
        });
      }
    });
  }
};

module.exports.findAll = async (callback) => {
  repository.findIntervals().then(({data,headers,status}) => {
      intervals = data.rows.map(i => (
        {
          _id: i.id,
          _rev: i.value._rev,
          nodeId: i.value.nodeId,
          start: i.value.start,
          end: i.value.end
        }
      ));
      callback(intervals);
  });
}

module.exports.remove = function(callback) {
  return async ( data ) => {
    const { interval } = data;
    repository.removeInterval(interval).then(({data,headers,stauts}) => {
      callback({_id:interval._id, nodeId:interval.nodeId});
    });
  }
}
