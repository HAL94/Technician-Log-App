const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mimetype');
    if (isValid) {
      error = null
    }
    cb(error, "server/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split('.')[0];
    const ext = MIME_TYPE_MAP[file.mimetype];
    console.log(name);
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

module.exports = multer({storage: storage, limits: { fileSize: 2000000 }}).single("profileImage");
