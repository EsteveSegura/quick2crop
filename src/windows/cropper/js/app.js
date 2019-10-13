const { ipcRenderer } = require('electron');

let dataFilesCropped = [];
let filesToCrop = [];
let actualCrop = {};
let filesDir = "";
let count = 0;
let cropper;


window.addEventListener('DOMContentLoaded', function () {
     hideUI()
});

ipcRenderer.on('getFiles', (event, files) => {
     hideWarn();
     flushData();
     showUI();
     let image = document.getElementById('image');
     filesToCrop = files.files;
     filesDir = files.dir;
     image.src = `${filesDir}/${filesToCrop[0]}`
     if (count == 0) {
          count = 0;
          if (image.complete) {
               start.call(image);
          } else {
               image.onload = start;
          }
     }
});

function cropNextImage() {
     if (count == 0) {
          filesToCrop.shift()
          cropper.replace(`${filesDir}/${filesToCrop[0]}`)
     } else if (count == 1) {
          filesToCrop.shift()
          cropper.replace(`${filesDir}/${filesToCrop[0]}`)
     } else {
          filesToCrop.shift()
          cropper.replace(`${filesDir}/${filesToCrop[0]}`)
     }

     dataFilesCropped.push(actualCrop);
     count++;
     sendPictureToCut()
     flushSend()
     setTimeout(() => { cropper.clear(); }, 50);
     if (filesToCrop.length == 0) {
          hideCanvas()
          //sendPictureToCut()
          hideUI()
          cropper.destroy()
     }
}

function skipNextImage() {
     if (count == 0) {
          filesToCrop.shift()
          cropper.replace(`${filesDir}/${filesToCrop[0]}`)
     } else if (count == 1) {
          filesToCrop.shift()
          cropper.replace(`${filesDir}/${filesToCrop[0]}`)
     } else {
          filesToCrop.shift()
          cropper.replace(`${filesDir}/${filesToCrop[0]}`)
     }

     count++;
     sendPictureToCut()
     flushSend()
     setTimeout(() => { cropper.clear(); }, 50);
     if (filesToCrop.length == 0) {
          hideCanvas()
          //sendPictureToCut()
          hideUI()
          cropper.destroy()
     }
}

function hideCanvas() {
     document.getElementById('croper').style.display = "none";
}

function showCanvas() {
     document.getElementById('croper').style.display = "block";
}

function sendPictureToCut() {
     ipcRenderer.send('filesToCrop', dataFilesCropped)
}

function hideUI() {
     document.getElementById('ui').style.display = "none";
}

function showUI() {
     document.getElementById('ui').style.display = "block";
}

function hideWarn() {
     document.getElementById('warn').style.display = "none";
}

function flushSend() {
     dataFilesCropped = [];
}

function flushData() {
     dataFilesCropped = [];
     filesToCrop = [];
     actualCrop = {};
     filesDir = "";
}

function start() {
     showCanvas()
     
     let width = this.offsetWidth;
     let height = this.offsetHeight;
     console.log(width)
     console.log(height)
     canvas.width = width;
     canvas.height = height + 420;
     canvas.getContext('2d').drawImage(
          this,
          0, 0, this.naturalWidth , this.naturalHeight ,
          0, 0, width, height
     );

     cropper = new Cropper(canvas, {
          background: false,
          crop(event) {
               actualCrop = {
                    fileName: `${filesDir}/${filesToCrop[0]}`,
                    x: event.detail.x,
                    y: event.detail.y,
                    width: event.detail.width,
                    height: event.detail.height
               }
               console.log(actualCrop)
          }
     });

     setTimeout(() => { cropper.clear(); }, 50);
}


document.body.onkeyup = function (e) {
     if (e.keyCode == 32) {
          cropNextImage()
     }
}

document.getElementById('close').addEventListener('click', function () {
     window.close();
});