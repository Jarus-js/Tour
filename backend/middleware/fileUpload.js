const multer = require("multer");
const uuid = require("uuid/v1");
const MIME_TYPE_MAP = {
  "image/png": "png", //mimetype looks like image/png
  "image/jpeg": "jpeg",
  "image/jpg": "jpg"
};

const fileUpload = multer({
  //Where to store sth & which file to accept
  limits: 500000,
  storage: multer.diskStorage({//built-in disk storage driver
    //diskStorage is imp for storing file correctly
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]; //file.mimetype retrieves png,jpeg,jpg
      cb(null, uuid() + "." + ext);//generates random filename with right extensons
    }
  }),
  fileFilter: (req, file, cb) => { //validates we don't get invalid file
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; //file.mimetype retrieves png,jpeg,jpg
    let error = isValid ? null : new Error("Invalid mime type");
    cb(error, isValid);
  }
});

module.exports = fileUpload;
