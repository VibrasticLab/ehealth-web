const Iotdata = require("../models/iotdata");

exports.data_dummy = async (req,res,next)=>{
    const reqdevid = req.query.devid;
    await Iotdata.create({
        devid: reqdevid,
        datastring: "10;24;23;45;67;56"
    }).then(() => console.log("new data added"));
    res.send("new data added");
};
