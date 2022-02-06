const path = require("path");
var fs = require("fs");

function handleUploadFile(fileObj, savePath){
  var splitdotArray = fileObj.originalname.split("."); 
  var tmp_path = fileObj.path;
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(savePath +fileObj.filename + "." + splitdotArray[splitdotArray.length - 1]);
  src.pipe(dest);
  src.on("end", function () {
    fs.unlink(tmp_path, function () {
        
    });
  });
  src.on("error", function (err) {
    console.log(err.message);
    return err.message;
  });
  return null;
};


module.exports = {
    handleUploadFile
}
