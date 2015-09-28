function runPreview(e) {
  var output = document.getElementById('prof-pic-preview');
  output.src = URL.createObjectURL(e.target.files[0]);
}

function changeType() {
  document.getElementById('overlay-dark').classList.toggle('hide');
  document.getElementById('overlay-light').classList.toggle('hide');
}
