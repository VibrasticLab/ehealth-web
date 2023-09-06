const Vibio_terapi = require("../../../models/vibio_terapi");
const initParam = require("../../../helpers/init");
const { handleUploadFile } = require("../../../helpers/helper_functions");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
let { PythonShell } = require("python-shell");
const fs = require("fs");
const axios = require('axios');
const FormData = require('form-data');

const ngrokServer = process.env.NGROK_SERVER;

exports.recognitionSoundData = async (req, res, next) => {
  var start_time = Date.now();
  
  try {
    
    const formData = new FormData();
    formData.append("file_audio", fs.createReadStream(req.files[0].path));

    const response = await axios.post(ngrokServer + "/recognition", formData, {
      headers: {
        ...formData.getHeaders(),
        "Ngrok-Skip-Browser-Warning": "true",
      },
    });

    const time_exec_local = ((Date.now() - start_time) / 1000).toFixed(2);
    const response_ngrok = response.data;
    response_ngrok.time_exec_local = time_exec_local;

    res.json(response_ngrok);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    fs.unlinkSync(req.files[0].path);
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
