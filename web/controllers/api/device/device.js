const Device_Data = require("../../../models/device_data");
const initParam = require("../../../helpers/init");
const { handleUploadFile } = require("../../../helpers/helper_functions");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
let { PythonShell } = require("python-shell");
const fs = require("fs");

exports.sendData = async (req, res, next) => {
  // console.log(req.params.device_id);
  // console.log(JSON.stringify(req.body));
  // console.log(req.files);
  if (Object.keys(req.body).length != 0) {
    let tempJsonData = req.body;
    if (req.files.length != 0) {
      tempJsonData.file_audio = req.files[0].filename + "." + req.files[0].originalname.split(".")[1];
      console.log(tempJsonData.file_audio);
      handleUploadFile(req.files[0], "./public/uploads/batuk/");
    }
  
    PythonShell.run('./python-script/tryScript1.py', {args: [tempJsonData.file_audio]}, function (err, results) {
      if (err) throw err;
      console.log('results: %j', results);
    });

    // const device = await Device_Data.create({ device_id: req.params.device_id, json_data: JSON.stringify(tempJsonData)});
    // if (device) {
    //   res.json({
    //     status: "success",
    //     code: 200,
    //     message: "Success Insert Data",
    //   });
    // } else {
    //   res.json({
    //     status: "error",
    //     code: 404,
    //     message: device,
    //   });
    // }
  } else {
    res.json({
      status: "error",
      code: 404,
      message: "Empty Data",
    });
  }
};

exports.tryUpload = async (req, res, next) => {
  console.log(req.params.device_id);
  console.log(req.files);
  console.log(JSON.parse(JSON.stringify(req.body)));
  let returnedHandle = handleUploadFile(req.files[0], "./public/uploads/");
  console.log(returnedHandle);
  // console.log(JSON.stringify(req.body));
  // console.log(Date.now());
  // if (Object.keys(req.body).length != 0) {
  //   const device = await Device_Data.updateOne(
  //     { device_id: req.params.device_id, device_data: JSON.stringify(req.body), timestamps_data: Date.now() }, //Required
  //     { device_id: req.params.device_id, device_data: JSON.stringify(req.body), timestamps_data: Date.now() },
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
//     const device = await Device_Data.updateOne(
//       { device_id: req.params.device_id, device_data: JSON.stringify(req.body), timestamps_data: Date.now() }, //Required
//       { device_id: req.params.device_id, device_data: JSON.stringify(req.body), timestamps_data: Date.now() },
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
