function runPreview(e) {
  var output = document.getElementById('prof-pic-preview');
  output.src = URL.createObjectURL(e.target.files[0]);
}
