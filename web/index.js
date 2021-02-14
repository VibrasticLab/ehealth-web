const express = require("express");
const csrf = require("csurf");
const flash = require("connect-flash");
const path = require("path");

// import routing
const generalRoute = require("./routes/general");
const doctorRoute = require("./routes/doctor");
const patientRoute = require("./routes/patient");
const adminRoute = require("./routes/admin");
const authRoutes = require("./routes/auth");
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

// parsing body/file and expose public dir
app.use(parse.bodyJsonHandler);
app.use(parse.bodyParserHandler);
app.use(express.static(path.join(rootdir, "public")));

// security & authentication
app.use(db.sessionMiddleware);
app.use(csrfProtection);
app.use(auth.clientAuth);

// notification
app.use(flash());

// routing request
app.use(generalRoute);
app.use(patientRoute);
app.use(doctorRoute);
app.use(adminRoute);
app.use(authRoutes);
app.use(errorRoutes);

db.initMongoose(() => {
    const server = app.listen(8080);
});
