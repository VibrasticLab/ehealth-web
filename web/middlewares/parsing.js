const bodyParser = require("body-parser");
const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/data/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const exelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "exels");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.imageUploadHandler = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
}).array("image");
exports.excelFilterUploadHandler = multer({
  storage: exelStorage,
  fileFilter: excelFilter,
}).single("exel");
exports.bodyParserHandler = bodyParser.urlencoded({ extended: false });
exports.bodyJsonHandler = bodyParser.json();
