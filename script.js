//super viktigt
//https://www.construct.net/en/forum/construct-2/how-do-i-18/solved-imagedata-139293

function clampCol(value) {
  if (value < 0) {
    value = 0;
  } else if (value > 255) {
    value = 255;
  }

  return value;
}

function AvrageColor(arr) {
let num = 0;
for (let i = 0; i < arr.length; i++) {
  num += arr[i];
}
num /= arr.length;

return clampCol(num);
}

function Quantize(arr, steps) {


}



function convertURIToImageData(URI) {
return new Promise(function(resolve, reject) {
  if (URI == null) return reject();
  var canvas = document.createElement('canvas'),
  context = canvas.getContext('2d'),
  image = new Image();
  image.addEventListener('load', function() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    resolve(context.getImageData(0, 0, canvas.width, canvas.height));
  }, false);
  image.src = URI;
});
}

const image_input = document.querySelector("#imageInput");
image_input.addEventListener("change", function() {
const reader = new FileReader();
reader.addEventListener("load", () => {
  const uploaded_image = reader.result;
  hmm(uploaded_image);
  document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
});
reader.readAsDataURL(this.files[0]);
});

async function hmm(imageAA) {
let tmp;
convertURIToImageData(imageAA).then(function(imageData) {
  tmp = imageData;
 });

await new Promise(r => setTimeout(r, 2000));

const canvasRen = document.getElementById("canvas-rendered");
const ctx = canvasRen.getContext("2d");


//const myImageData = ctx.createImageData(1080, 1080);
let myImageData = ctx.createImageData(tmp);
myImageData =  tmp;
//let tmp = base64ToBuffer(imageAA);

console.log('----------------');
console.log(myImageData);
console.log(tmp)  

var start = Date.now();

let red;
let blue;
let green;
let alpha;
let currentPixelPos;
let currentPixel;
let qErr;

console.log(myImageData);
for (let x = 0; x < myImageData.width - 1; x++) {
    for (let y = 0; y < myImageData.height - 1; y++) {


        currentPixelPos = y * (myImageData.width * 4) + x * 4;
        currentPixel = [
          myImageData.data[currentPixelPos],
          myImageData.data[currentPixelPos + 1],
          myImageData.data[currentPixelPos + 2],
          myImageData.data[currentPixelPos + 3],
        ];

        const avragedCol = AvrageColor(currentPixel) / 255;
        let old = [avragedCol,avragedCol,avragedCol];


        let qErr = currentPixel.filter(x => !old.includes(x));
        let qErrNew = qErr[0];

        myImageData.data[(y ) * (myImageData.width * 4) + (x + 4) * 4] += qErrNew * (7/16);
        myImageData.data[(y + 4) * (myImageData.width * 4) + (x - 4) * 4] += qErrNew * (3/16);
        myImageData.data[(y + 4) * (myImageData.width * 4) + (x) * 4] += qErrNew * (5/16);
        myImageData.data[(y + 4) * (myImageData.width * 4) + (x + 4) * 4] += qErrNew * (1/16);
    }
}

console.log(myImageData);
canvasRen.width = myImageData.width;
canvasRen.height = myImageData.height;
ctx.putImageData(myImageData, 0, 0);

var end = Date.now();
console.log(`Execution time: ${end - start} ms`);

}

