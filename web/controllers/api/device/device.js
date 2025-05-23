const Device_Data_Cough = require("../../../models/device_data_cough");
const Device_Data_Audiometri = require("../../../models/device_data_audiometri");
const Device_Data_Cough_Naracoba = require("../../../models/device_data_cough_naracoba");
const device_data_coughTBPrimerSchema = require("../../../models/device_data_cough_tbprimer");

const Settings = require("../../../models/settings");
const initParam = require("../../../helpers/init");
const { handleUploadFile } = require("../../../helpers/helper_functions");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const path = require("path");
let { PythonShell } = require("python-shell");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

exports.sendData = async (req, res, next) => {
  // console.log(req.params.device_id);
  // console.log(JSON.stringify(req.body));
  // console.log(req.files);
  var uniqueID = new Date().getTime().toString(36);
  //console.log(uniqueID);
  let tempJsonData = JSON.parse(JSON.stringify(req.body));
  console.log(req.body);
  if (Object.keys(req.body).length != 0) {
    if (req.files) {
      if (req.files.length != 0 && !Object.prototype.hasOwnProperty.call(req.body, "audiogram")) {
        tempJsonData.file_audio = req.files[0].filename + "." + req.files[0].originalname.split(".")[1];
        handleUploadFile(req.files[0], "./public/uploads/batuk/");
  
        const device = await Device_Data_Cough.create({ uuid: uniqueID, device_id: req.params.device_id, json_data: JSON.stringify(tempJsonData), cough: 99, covid: 99 });
        if (device) {
          res.json({
            status: "success",
            code: 200,
            message: "Success Insert Data",
          });
        } else {
          res.json({
            status: "error",
            code: 404,
            message: device,
          });
        }
  
        PythonShell.run("./python-script/determinationCough.py", { args: [tempJsonData.file_audio] }, function (err, results) {
          if (err) throw err;
          //console.log('results: %j', results);
          var cough = results[1];
          console.log(results[2]);
          Device_Data_Cough.updateOne({ uuid: uniqueID }, { cough: cough }).then((result) => {
            console.log(result);
          });
        });

        PythonShell.run("./python-script/determinationCovid.py", { args: [tempJsonData.file_audio] }, function (err, results) {
          if (err) throw err;
          //console.log('results: %j', results);
          var covid = results[1];
          console.log(results[2]);
          Device_Data_Cough.updateOne({ uuid: uniqueID }, { covid: covid }).then((result) => {
            console.log(result);
          });
        });

        
        // const recog_server = await Settings.findOne({ key: "batuk_recognition_server" });
        // if (!recog_server) {
        //   console.log(error);
        //   res.status(500).json({ error: "Internal Server Error" });
        //   return;
        // }
      
        // try {
        //   const formData = new FormData();
        //   formData.append("file_audio", fs.createReadStream(req.files[0].path));
      
        //   const response = await axios.post(recog_server.value + "/recognition", formData, {
        //     headers: {
        //       ...formData.getHeaders(),
        //       "Ngrok-Skip-Browser-Warning": "true",
        //     },
        //   });
    
        //   const response_ngrok = response.data;  
        //   console.log(response_ngrok)
        // } catch (error) {
        //   console.log(error);
        // }                               
      }
    } else if (Object.prototype.hasOwnProperty.call(req.body, "audiogram")) {
      console.log(tempJsonData)
      const device = await Device_Data_Audiometri.create({ uuid: uniqueID, device_id: req.params.device_id, json_data: JSON.stringify(tempJsonData) });
      if (device) {
        res.json({
          status: "success",
          code: 200,
          message: "Success Insert Data",
        });
      } else {
        res.json({
          status: "error",
          code: 404,
          message: device,
        });
      }
    } else {
      res.json({
        status: "error",
        code: 400,
        message: "Empty Request",
      });
    }

    // User.updateOne(
    //   { _id: req.session.user._id },
    //   { $push: { patient: user.upserted[0]._id } }
    // ).then((result) => {});
  } else {
    res.json({
      status: "error",
      code: 404,
      message: "Empty Data",
    });
  }
};

exports.sendData_Naracoba = async (req, res, next) => {
  var uniqueID = new Date().getTime().toString(36);
  let tempJsonData = JSON.parse(JSON.stringify(req.body));
  if (Object.keys(req.body).length != 0) {
    if (req.files) {
      if (req.files.length != 0 && !Object.prototype.hasOwnProperty.call(req.body, "audiogram")) {
        tempJsonData.file_audio = req.files[0].filename + "." + req.files[0].originalname.split(".")[1];
        handleUploadFile(req.files[0], "./public/uploads/batuk_naracoba/");
  
        const device = await Device_Data_Cough_Naracoba.create({ uuid: uniqueID, device_id: req.params.device_id, json_data: JSON.stringify(tempJsonData), cough: 99, covid: 99 });
        if (device) {
          res.json({
            status: "success",
            code: 200,
            message: "Success Insert Data",
          });
        } else {
          res.json({
            status: "error",
            code: 404,
            message: device,
          });
        }
      }
    } else if (Object.prototype.hasOwnProperty.call(req.body, "audiogram")) {
      console.log(tempJsonData)
      const device = await Device_Data_Audiometri.create({ uuid: uniqueID, device_id: req.params.device_id, json_data: JSON.stringify(tempJsonData) });
      if (device) {
        res.json({
          status: "success",
          code: 200,
          message: "Success Insert Data",
        });
      } else {
        res.json({
          status: "error",
          code: 404,
          message: device,
        });
      }
    } else {
      res.json({
        status: "error",
        code: 400,
        message: "Empty Request",
      });
    }
  } else {
    res.json({
      status: "error",
      code: 404,
      message: "Empty Data",
    });
  }
};

exports.sendData_TBPrimer = async (req, res, next) => {
  var uniqueID = new Date().getTime().toString(36);
  let tempJsonData = JSON.parse(JSON.stringify(req.body));

  if (Object.keys(req.body).length != 0) {
    if (req.files) {
      if (req.files.length != 0) {
        tempJsonData.file_audio = req.files[0].filename + "." + req.files[0].originalname.split(".")[1];
        handleUploadFile(req.files[0], "./public/uploads/batuk_tbprimer/");
  
        const device = await device_data_coughTBPrimerSchema.create({ uuid: uniqueID, device_id: req.params.device_id, json_data: JSON.stringify(tempJsonData), cough_type: tempJsonData.cough_type, cough: 99});
        if (device) {
          res.json({
            status: "success",
            code: 200,
            message: "Success Insert Data",
          });
        } else {
          res.json({
            status: "error",
            code: 404,
            message: device,
          });
        }
      }
    } else {
      res.json({
        status: "error",
        code: 400,
        message: "Empty Request",
      });
    }
  } else {
    res.json({
      status: "error",
      code: 404,
      message: "Empty Data",
    });
  }
};

exports.setRecognitionServer = async (req, res, next) => {
  const update_setting = await Settings.updateOne(
    { key: req.body.key_setting },
    {
      value: req.body.value_setting,
    },
    { upsert: true }
  );

  if (update_setting.ok > 0) {
    res.json({
      status: "success",
      code: 200,
      message: "Success Insert/Update Data",
    });
  } else {
    res.json({
      status: "error",
      code: 404,
      message: "Failure Insert/Update Data",
    });
  }
};

exports.checkRecognitionServer = async (req, res, next) => {
  const recog_server = await Settings.findOne({ key: "batuk_recognition_server" });
  if (recog_server.value == '') {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }

  try {
    const response = await axios.get(recog_server.value, {
      headers: {
        "Ngrok-Skip-Browser-Warning": "true",
      },
    });

    const response_ngrok = response.data;

    res.json(response_ngrok);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.testAPI = async (req, res, next) => {
  // console.log(req.params.device_id);
  // console.log(req.files);
  // console.log(JSON.parse(JSON.stringify(req.body)));
  // let returnedHandle = handleUploadFile(req.files[0], "./public/uploads/");
  // console.log(returnedHandle);

  PythonShell.run("./python-script/tryScript2.py", { args: [] }, function (err, results) {
    if (err) throw err;
    console.log("results: %j", results);
    res.json({
      status: "success",
      code: 200,
      data: JSON.stringify(results),
    });
  });
  // console.log(JSON.stringify(req.body));
  // console.log(Date.now());
  // if (Object.keys(req.body).length != 0) {
  //   const device = await Device_Data_Cough.updateOne(
  //     { device_id: req.params.device_id, Device_Data_Cough: JSON.stringify(req.body), timestamps_data: Date.now() }, //Required
  //     { device_id: req.params.device_id, Device_Data_Cough: JSON.stringify(req.body), timestamps_data: Date.now() },
  //     { upsert: true } //Required
  //   );
  //   console.log(device);
  //   if (device.upserted.length > 0) {
  //     res.json({
  //       status: "success",
  //       code: 200,
  //       message: "Success Insert Data",
  //     });
  //   }
  // } else {
  //
  // }
};

// exports.sendData = async (req, res, next) => {
//   console.log(req.params.device_id);
//   console.log(JSON.stringify(req.body));
//   console.log(Date.now());
//   if (Object.keys(req.body).length != 0) {
//     const device = await Device_Data_Cough.updateOne(
//       { device_id: req.params.device_id, Device_Data_Cough: JSON.stringify(req.body), timestamps_data: Date.now() }, //Required
//       { device_id: req.params.device_id, Device_Data_Cough: JSON.stringify(req.body), timestamps_data: Date.now() },
//       { upsert: true } //Required
//     );
//     console.log(device);
//     if (device.upserted.length > 0) {
//       res.json({
//         status: "success",
//         code: 200,
//         message: "Success Insert Data",
//       });
//     }
//   } else {
//     res.json({
//       status: "error",
//       code: 404,
//       message: "Empty Data",
//     });
//   }

//   // const email = req.body.email.trim();
//   // const password = req.body.password.trim();
//   // let loadedUser;
//   // try {
//   //   const user = await User.findOne({ email: email });
//   //   if (!user) {
//   //     res
//   //       .status(401)
//   //       .json({ message: "A user with this email could not be found." });
//   //   } else {
//   //     loadedUser = user;
//   //     const isEqual = await bcrypt.compare(password, user.password);
//   //     if (!isEqual) {
//   //       res.status(401).json({ message: "Wrong password!" });
//   //     } else {
//   //       const token = jwt.sign(
//   //         {
//   //           email: loadedUser.email,
//   //           userId: loadedUser._id.toString(),
//   //         },
//   //         initParam.SECRETE_USER_API_KEY,
//   //         { expiresIn: "12h" }
//   //       );
//   //       let decodedToken = jwt.verify(token, initParam.SECRETE_USER_API_KEY);
//   //       res.status(200).json({
//   //         token: "Bearer " + token,
//   //         userId: loadedUser._id.toString(),
//   //         expired: decodedToken.exp,
//   //       });
//   //     }
//   //   }
//   // } catch (err) {
//   //   console.log(err);
//   //   // next(err);
//   //   // res.status(500).json({ message: "internal server error" });
//   // }
// };

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)).split("-")[0];
}
