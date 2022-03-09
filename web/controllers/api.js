const User = require("../models/user");
const Device = require("../models/device");
const Device_Data = require("../models/device_data");
const Batuk_Data = require("../models/batuk_data");
const initParam = require("../helpers/init");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { handleUploadFile } = require("../helpers/helper_functions");

exports.login = async (req, res, next) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ message: "A user with this email could not be found." });
    } else {
      loadedUser = user;
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        res.status(401).json({ message: "Wrong password!" });
      } else {
        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
          },
          initParam.SECRETE_USER_API_KEY,
          { expiresIn: "12h" }
        );
        let decodedToken = jwt.verify(token, initParam.SECRETE_USER_API_KEY);
        res.status(200).json({
          token: "Bearer " + token,
          userId: loadedUser._id.toString(),
          expired: decodedToken.exp,
        });
      }
    }
  } catch (err) {
    console.log(err);
    // next(err);
    // res.status(500).json({ message: "internal server error" });
  }
};

exports.home = async (req, res, next) => {
  try {
    const adminData = await User.findById(req.userId, {
      doctorList: 1,
    });
    const totalPatient = await User.count({
      role: "patient",
      doctor: adminData.doctorList,
    });
    const doctorData = await User.find({
      role: "doctor",
      admin: req.userId,
    });
    const deviceDataList = await Device.find({
      admin: req.userId,
    });
    res.status(200).json({
      totalPatient: totalPatient,
      totalDoctor: doctorData.length,
      totalDevice: deviceDataList.length,
    });
  } catch (err) {
    console.log(err);
    // next(err);
    // res.status(500).json({ message: "internal server error" });
  }
};

exports.data_batuk = async (req, res, next) => {
  try {
    const resultsPerPage = 25;
    let page = req.body.page >= 1 ? req.body.page : 1;
    var query = req.body.search != undefined && req.body.search ? { email: req.body.search } : {};
    var searchVal = req.body.search != undefined && req.body.search ? req.body.search : "";

    const batukData_count = await Batuk_Data.countDocuments(query);
    const batukData = await Batuk_Data.find(query)
      .sort({ time: "desc" })
      .limit(resultsPerPage)
      .skip(resultsPerPage * (page - 1));

    // http://localhost/uploads/batuk_primer/5b7897cd2284caca26569c19eff469ad.wav
    for (let index = 0; index < batukData.length; index++) {
      batukData[index].filename = "https://elbicare.my.id/uploads/batuk_primer/" + batukData[index].filename;
    }

    res.status(200).json({
      batukData: batukData,
      currentPage: page,
      pages: Math.ceil(batukData_count / resultsPerPage),
      searchVal: searchVal,
      lastIndex: resultsPerPage * (page - 1),
      totalCount: batukData_count,
    });
  } catch (err) {
    console.log(err);
    // next(err);
    // res.status(500).json({ message: "internal server error" });
  }
};

exports.device_list = async (req, res, next) => {
  try {
    var queryObject = { admin: req.userId };

    const resultsPerPage = 10;
    let page = req.body.page >= 1 ? req.body.page : 1;
    if (req.body.type && req.body.type != "") {
      queryObject.type = req.body.type;
    }
    if (req.body.status && req.body.status != "") {
      queryObject.status = req.body.status;
    }

    const deviceDataList = await Device.find(queryObject)
      .limit(resultsPerPage)
      .skip(resultsPerPage * (page - 1));

    deviceDataList_count = deviceDataList.length;

    res.status(200).json({
      batukData: deviceDataList,
      currentPage: page,
      pages: Math.ceil(deviceDataList_count / resultsPerPage),
      searchVal: queryObject,
      lastIndex: resultsPerPage * (page - 1),
      totalCount: deviceDataList_count,
    });
  } catch (err) {
    console.log(err);
    // next(err);
    // res.status(500).json({ message: "internal server error" });
  }
};

exports.device_detail = async (req, res, next) => {
  try {
    const resultsPerPage = 10;
    let page = req.body.page >= 1 ? req.body.page : 1;

    const deviceData = await Device.find({
      admin: req.userId,
      device_id: req.body.device_id,
    });

    const deviceData_Datas = await Device_Data.find({
      device_id: req.body.device_id,
    })
      .limit(resultsPerPage)
      .skip(resultsPerPage * (page - 1))
      .sort({ time: "desc" });

    deviceData_count = deviceData_Datas.length;

    for (let index = 0; index < deviceData_Datas.length; index++) {
      var JsonData = JSON.parse(deviceData_Datas[index].json_data);
      JsonData.file_audio = "https://elbicare.my.id/uploads/batuk/" + JsonData.file_audio;
      deviceData_Datas[index].json_data = JSON.stringify(JsonData);
    }
    // http://localhost/uploads/batuk/5b7897cd2284caca26569c19eff469ad.wav

    res.status(200).json({
      device_data: deviceData_Datas,
      device_detail: deviceData,
      currentPage: page,
      pages: Math.ceil(deviceData_count / resultsPerPage),
      lastIndex: resultsPerPage * (page - 1),
      totalCount: deviceData_count,
    });
  } catch (err) {
    console.log(err);
    // next(err);
    // res.status(500).json({ message: "internal server error" });
  }
};

exports.submit_data_batuk = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length != 0) {
      let tempJsonData = req.body;

      if (req.files.length != 0) {
        var splitdotArray = req.files[0].originalname.split(".");
        tempJsonData.file_audio = req.files[0].filename + "." + splitdotArray[splitdotArray.length - 1];
        handleUploadFile(req.files[0], "./public/uploads/batuk_primer/");
      }

      var uniqueID = new Date().getTime().toString(36);

      const batuk = await Batuk_Data.create({
        uuid: uniqueID,
        email: req.body.email,
        background_noise: req.body.back_noise,
        submit_method: req.body.method_upload,
        filename: tempJsonData.file_audio,
      });

      if (batuk) {
        res.status(200).json({
          code: 200,
          success: true,
          message: "Success Upload Data Batuk",
        });
      } else {
        res.status(500).json({
          code: 500,
          success: false,
          message: "Error Input Data",
        });
      }
    } else {
      res.status(400).json({
        code: 400,
        success: false,
        message: "Empty Data",
      });
    }
    // const resultsPerPage = 10;
    // let page = req.body.page >= 1 ? req.body.page : 1;

    // const deviceData = await Device.find({
    //   admin: req.userId,
    //   device_id: req.body.device_id,
    // });

    // const deviceData_Datas = await Device_Data.find({
    //   device_id: req.body.device_id,
    // })
    //   .limit(resultsPerPage)
    //   .skip(resultsPerPage * (page - 1))
    //   .sort({ time: "desc" });

    // deviceData_count = deviceData_Datas.length;

    // for (let index = 0; index < deviceData_Datas.length; index++) {
    //   var JsonData = JSON.parse(deviceData_Datas[index].json_data);
    //   JsonData.file_audio = 'https://elbicare.my.id/uploads/batuk/' + JsonData.file_audio;
    //   deviceData_Datas[index].json_data = JSON.stringify(JsonData);
    // }
    // // http://localhost/uploads/batuk/5b7897cd2284caca26569c19eff469ad.wav

    // res.status(200).json({
    //   device_data: deviceData_Datas,
    //   device_detail: deviceData,
    //   currentPage: page,
    //   pages: Math.ceil(deviceData_count / resultsPerPage),
    //   lastIndex: resultsPerPage * (page - 1),
    //   totalCount: deviceData_count,
    // });
  } catch (err) {
    console.log(err);
    // next(err);
    // res.status(500).json({ message: "internal server error" });
  }
};
