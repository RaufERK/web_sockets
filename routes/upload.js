const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'public/uploads');
  },
  filename: (request, file, callback) => {
    console.log('NEW FILENAME |====>', file.originalname);
    callback(null, file.originalname);
  },
});
const upload = multer({ storage }).any('img');

router
  .route('/')
  .get((req, res) => {
    res.render('upload');
  })
  .post(upload, (req, res) => {
    res.redirect('/upload');
  });

module.exports = router;
