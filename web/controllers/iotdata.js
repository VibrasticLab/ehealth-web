const Iotdata = require("../models/iotdata");

//URL: http://urldomainip/iotdata?devid=xxx&data=yyy

exports.data_dummy = async (req,res,next)=>{
    const reqdevid = req.query.devid;
    const reqdata = req.query.data;
    await Iotdata.create({
        devid: reqdevid,
        datastring: reqdata
    }).then(() => console.log("new data added"));
    res.send("new data added");
};
