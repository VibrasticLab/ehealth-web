const express = require("express");
const csrf = require("csurf");
const flash = require("connect-flash");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
var moment = require("moment");
var bodyParser = require("body-parser");
var cors = require("cors");

// import routing
const generalRoute = require("./routes/general");
//const iotdataRoutes = require("./routes/iotdata");
const doctorRoute = require("./routes/doctor");
const patientRoute = require("./routes/patient");
const adminRoute = require("./routes/admin");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const formRoutes = require("./routes/form");
const vibioRoutes = require("./routes/vibio");
const errorRoutes = require("./routes/error");

// import helper
const rootdir = require("./helpers/path");
const initPraram = require("./helpers/init");

// import middleware
const parse = require("./middlewares/parsing");
const db = require("./middlewares/database");
const auth = require("./middlewares/auth");

const app = express();
const csrfProtection = csrf();

// set template engine
app.set("view engine", "ejs");
app.set("views", "views");
app.locals.moment = require("moment");

// // configure CORS middleware
// const corsOptions = {
//   origin: "http://example.com",
//   methods: ["GET", "POST"],
// };
app.use(cors());

// parsing body/file and expose public dir
app.use(parse.bodyJsonHandler);
app.use(parse.bodyParserHandler);
app.use(express.static(path.join(rootdir, "public")));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// API
app.use(apiRoutes);
app.use(formRoutes);

// security & authentication
app.use(db.sessionMiddleware);
app.use(disableAPICSRF(csrf()));
app.use(auth.clientAuth);

// notification
app.use(flash());

// routing request
app.use(generalRoute);
//app.use(iotdataRoutes);
app.use(patientRoute);
app.use(doctorRoute);
app.use(adminRoute);
app.use(authRoutes);
app.use(vibioRoutes);

//must before errorRoutes
app.use(errorRoutes);

db.initMongoose(() => {
  const server = app.listen(8080);
});

var skipCSRFArray = ["/api/device/", "/api/vibio/", "/form/", "/submit-data-batuk"];

function disableAPICSRF(fn) {
  return function (req, res, next) {
    console.log(JSON.stringify(req.path)); //Debug Path
    var skipCSRF = false;
    for (let index = 0; index < skipCSRFArray.length; index++) {
      if (req.path.includes(skipCSRFArray[index])) {
        skipCSRF = true;
      }
    }
    if (skipCSRF && req.method === "POST") {
      next();
    } else {
      fn(req, res, next);
    }
  };
}
