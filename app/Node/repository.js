const allNodes = "nodes/_view/all";
const db = require("../database.js");

const updateNode = (node) => db.update(node);

const deleteNode = ( node ) => db.remove(node._id, node._rev);

const findNode = ( id ) => db.findById(id);

const findNodes = () => db.findAll(allNodes);

module.exports = {
    updateNode,
    deleteNode,
    findNode,
    findNodes
};
