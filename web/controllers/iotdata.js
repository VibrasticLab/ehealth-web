const iotdata = require("../models/iotdata");
const Iotdata = require("../models/iotdata");

exports.data_dummy = async (req,res,next)=>{
    const adata = new Iotdata({devid: "5510ecg", datastring: "55;65;72;33;44"});
    await adata.save().then(()=>console.log("new data added"));
    res.send("new data added");
};