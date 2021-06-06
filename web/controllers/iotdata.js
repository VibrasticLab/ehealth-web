const iotdata = require("../models/iotdata");
const Iotdata = require("../models/iotdata");

exports.data_dummy = async (req,res,next)=>{
    await Iotdata.update({devid: "5510ecg", datastring: "55;65;72;33;44"},{ upsert: true });
    res.send("new data added");
};