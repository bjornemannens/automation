const NodeCouchDb = require('node-couchdb');
const dbName = "automation";
const viewRoot = "_design/"

const couch = new NodeCouchDb({
  auth: {
    user:'admin',
    password:'12345'
  }
})

const find = function(relativeView, queryOptions) {
  return couch.get(dbName, viewRoot + relativeView, queryOptions);
}

const findById = function (id) {
  return couch.get(dbName, id);
}

const findAll = function(relativeView) {
  return module.exports.find(relativeView, {});
}

const insert = function (document) {
  return couch.insert(dbName, document);
}

const update = function (document) {
  return couch.update(dbName, document);
}

const remove = function(docId, docRev) {
  return couch.del(dbName, docId, docRev);
}

module.exports = {
  find,
  findById,
  findAll,
  insert,
  update,
  remove
}
