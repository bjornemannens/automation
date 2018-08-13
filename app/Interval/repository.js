const allIntervals = "intervals/_view/all"
const db = require("../database.js");

const saveInterval = ( interval ) => {return db.insert(interval);}

const findIntervals = () => {return db.findAll(allIntervals);}

const findInterval = (id) => {return db.findById(_id);}

const removeInterval = (interval) => {return db.remove(interval._id, interval._rev);}

module.exports = {
    saveInterval,
    findInterval,
    findIntervals,
    removeInterval
};
