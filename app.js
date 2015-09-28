var express = require('express');
var multer = require('multer');
var images = require('images');
var fs = require("fs");

var app = express();
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  limits: {
    files: 1,
    fileSize: 10000000
  }
});

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post('/render', upload.single('prof-pic-original'), function(req, res, next) {
  if (!req.file) return res.end("Please upload a profile picture to donut-ify.");
  _render(res, req.file);
});

app.listen(3000, function() {
  console.log("Working on port 3000");
});


// Combining images
var donut_overlay;
fs.readFile(__dirname + '/public/donut_overlay.png', function(err, file) {
  if (err) throw "Could not load overlay image!";
  donut_overlay = images(file);
});

var _render = function(res, file) {
  var base, base_width, base_height;
  try { // First make sure we can read file as an image
    base = images(file.buffer);
  } catch (e) {
    return res.end("Upload failed, please try again with another image");
  }
  base_width = base.width();
  base_height = base.height();

  // Check that the image is correct proportions
  if (base_width !== base_height) return res.end("Please only use images that are square!");
  if (base_width < 180) return res.end("Image must be at least 180x180 pixels!");

  // Merge images and send response
  var overlay = images(donut_overlay).resize(base_width / 2);
  var merged = base
        .draw(overlay, 0, base_height - overlay.height())
        .encode("jpg", { quality: 99 });
  // Send...
  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Content-disposition', 'attachment; filename=donut_dash_prof_pic.jpg');
  res.write(merged, 'binary');
  res.end();
};
