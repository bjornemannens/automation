const repository = require( "./repository" );


const find = async (id, callback) => {
  repository.findNode(id).then(({data, headers, status}) => {
    callback(data)
  })
}

const findAll = async (callback) => {
  repository.findNodes().then(({data,headers,status}) => {
    nodes = data.rows.map(n =>
      ({
        _id: n.id,
        _rev: n.value._rev,
        type: n.value.type,
        name: n.value.name,
        control: n.value.control,
        controlPower: n.value.controlPower
      })
    );

    callback(nodes);
  });
}

const edit = function(callback){
  return async ( data ) => {
    const { node } = data;
    repository.updateNode(node).then(({data,headers,status}) => {
      newNode = Object.assign({}, node);
      newNode._rev = data.rev;
      callback(newNode);
    });
  };
}

module.exports = {
  find,
  findAll,
  edit
}
