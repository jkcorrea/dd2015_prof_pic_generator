var express = require('express');
var multer = require('multer');
var fs = require("fs");

var Canvas = require('canvas'),
    Image = Canvas.Image;

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
  _render(res, req.file, req.body['overlay-type-selector']);
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Working on port 3000");
});


// Combining images
var donut_overlay;
fs.readFile(__dirname + '/public/overlay_dark.png', function(err, file) {
  if (err) throw "Could not load overlay image!";
  overlay_dark = file;
});
fs.readFile(__dirname + '/public/overlay_light.png', function(err, file) {
  if (err) throw "Could not load overlay image!";
  overlay_light = file;
});

var _render = function(res, file, theme) {
  var fail = function(err) { res.end("Upload failed, please try again with another image"); }

  var base = new Image

  base.onerror = fail;
  base.onload = function() {
  // Check that the image is correct proportions
    if (base.width !== base.height) return res.end("Please only use images that are square!");
    if (base.width < 500) return res.end("Image must be at least 500x500 pixels!");

    var overlay = new Image;
    overlay.onerror = fail;
    overlay.onload = function() {
      var canvas = new Canvas(overlay.width, overlay.height);
      var ctx = canvas.getContext('2d');
      ctx.drawImage(base, 0, 0, overlay.width, overlay.height);
      ctx.drawImage(overlay, 0, 0, overlay.width, overlay.height);

      // Send...
      var merged = canvas.toBuffer();
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-disposition', 'attachment; filename=donut_dash_prof_pic.png');
      res.write(merged, 'binary');
      res.end();
    };

    overlay.src = (theme === 'dark') ? overlay_dark : overlay_light;
  };

  base.src = file.buffer;
};
