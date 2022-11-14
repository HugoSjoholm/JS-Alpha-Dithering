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

function GetPixel(x,y, myImageData) {
  currentPixelPos = y * (myImageData.width * 4) + x * 4;
  return [
    myImageData.data[currentPixelPos],
    myImageData.data[currentPixelPos + 1],
    myImageData.data[currentPixelPos + 2],
    myImageData.data[currentPixelPos + 3],
  ];
}

function GetErr(oldP, newP) {
  let tmp = [];

  for (let i = 0; i < oldP.length; i++) {
    tmp.push(oldP[i] - newP[i]);
  }

  return tmp;
}

function SetPixel(x, y, colors) {
  myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 0] = colors[0];
  myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 1] = colors[1];
  myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 2] = colors[2];
  myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 3] = colors[4];
}

function updateAllChannels(mode, colors, x, y) {
  switch (mode) {
    case '1':
      myImageData.data[(y    ) * (myImageData.width * 4) + (x + 4) * 4 + 0] = colors;
      myImageData.data[(y + 4) * (myImageData.width * 4) + (x - 4) * 4 + 1] = colors;
      myImageData.data[(y + 4) * (myImageData.width * 4) + (x    ) * 4 + 2] = colors;

      break;
    case '3':
      myImageData.data[(y    ) * (myImageData.width * 4) + (x + 4) * 4 + 0] = colors[0];
      myImageData.data[(y + 4) * (myImageData.width * 4) + (x - 4) * 4 + 1] = colors[1];
      myImageData.data[(y + 4) * (myImageData.width * 4) + (x    ) * 4 + 2] = colors[2];
      break;
    case '4':
      myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 0] = colors[0];
      myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 1] = colors[1];
      myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 2] = colors[2];
      myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 2] = colors[4];
      break;
    case 'alpha':
      myImageData.data[(y    ) * (myImageData.width * 4) + (x + 4) * 4 + 3] = colors;
      break;
    case '0':
      myImageData.data[(y ) * (myImageData.width * 4) + (x ) * 4 + 0] = colors;
      myImageData.data[(y ) * (myImageData.width * 4) + (x ) * 4 + 1] = colors;
      myImageData.data[(y ) * (myImageData.width * 4) + (x ) * 4 + 2] = colors;

    break;
      default:
      console.log('no operation mode givven in updateAllChannels Fucntion');
      break;
  }
}

let myImageData;



async function hmm(imageAA) {
  let tmp;
  convertURIToImageData(imageAA).then(function(imageData) {
    tmp = imageData;
  });



  
  await new Promise(r => setTimeout(r, 20));


  const canvasRen = document.getElementById("canvas-rendered");
  const ctx = canvasRen.getContext("2d");


  //const myImageData = ctx.createImageData(1080, 1080);
  myImageData = ctx.createImageData(tmp);
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
  let tmpCol;
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

          const avragedCol = AvrageColor([
            myImageData.data[currentPixelPos],
            myImageData.data[currentPixelPos + 1],
            myImageData.data[currentPixelPos + 2]
          ]);
          let old = [
            255 * Math.round(myImageData.data[currentPixelPos]/256),
            255 * Math.round(myImageData.data[currentPixelPos + 1]/256),
            255 * Math.round(myImageData.data[currentPixelPos + 2]/256),
          ];
          //let qErr = currentPixel.filter(x => !old.includes(x));
          let qErr = GetErr(old, currentPixel);
          let qErrNew = qErr[0];

  /*
          updateAllChannels('1', avragedCol, x + 4, y    );
          updateAllChannels('1', avragedCol, x - 4, y + 1);
          updateAllChannels('1', avragedCol, x    , y + 1);
          updateAllChannels('1', avragedCol, x + 4, y + 1);
          
          */
//JS implumentation
            myImageData.data[(y    ) * (myImageData.width * 4) + (x + 1) * 4 + 0] += qErr[0] * (7/16);
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x - 1) * 4 + 0] += qErr[0] * (3/16);
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x    ) * 4 + 0] += qErr[0] * (5/16);
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x + 1) * 4 + 0] += qErr[0] * (1/16);
          
            myImageData.data[(y    ) * (myImageData.width * 4) + (x + 1) * 4 + 1] += qErr[1] * (7/16);
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x - 1) * 4 + 1] += qErr[1] * (3/16);
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x    ) * 4 + 1] += qErr[1] * (5/16);
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x + 1) * 4 + 1] += qErr[1] * (1/16);
          
            
            myImageData.data[(y    ) * (myImageData.width * 4) + (x + 1) * 4 + 2] += qErr[2] * (7/16);
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x - 1) * 4 + 2] += qErr[2] * (3/16);
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x    ) * 4 + 2] += qErr[2] * (5/16);
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x + 1) * 4 + 2] += qErr[2] * (1/16);
          
            myImageData.data[(y    ) * (myImageData.width * 4) + (x + 1) * 4 + 3] += 255;
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x - 1) * 4 + 3] += 255;
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x    ) * 4 + 3] += 255;
            myImageData.data[(y + 1) * (myImageData.width * 4) + (x + 1) * 4 + 3] += 255;
            
          /* 




          ""copied"" from C#
          tmpCol = GetPixel(x + 1, y, myImageData);
          SetPixel(
            x + 1, y,[
            tmpCol[0] += qErr[0] * (7 / 16),
            tmpCol[1] += qErr[1] * (7 / 16),
            tmpCol[2] += qErr[2] * (7 / 16),
            tmpCol[3] += qErr[3] * (7 / 16)
          ]);
          
          tmpCol = GetPixel(x + 1, y, myImageData);
          SetPixel(
            x - 1, y + 1,[
            tmpCol[0] += qErr[0] * (7 / 16),
            tmpCol[1] += qErr[1] * (7 / 16),
            tmpCol[2] += qErr[2] * (7 / 16),
            tmpCol[3] += qErr[3] * (7 / 16)
          ]);

          tmpCol = GetPixel(x + 1,y,myImageData);
          SetPixel(
            x    , y + 1,[
            tmpCol[0] += qErr[0] * (7 / 16),
            tmpCol[1] += qErr[1] * (7 / 16),
            tmpCol[2] += qErr[2] * (7 / 16),
            tmpCol[3] += qErr[3] * (7 / 16)
          ]);

          tmpCol = GetPixel(x + 1,y,myImageData);
          SetPixel(
            x + 1, y + 1,[
            tmpCol[0] += qErr[0] * (7 / 16),
            tmpCol[1] += qErr[1] * (7 / 16),
            tmpCol[2] += qErr[2] * (7 / 16),
            tmpCol[3] += qErr[3] * (7 / 16)
          ]);
          
          
          
          myImageData.data[(y    ) * (myImageData.width * 4) + (x + 1) * 4 + 3] += 255;
          myImageData.data[(y + 1) * (myImageData.width * 4) + (x - 1) * 4 + 3] += 255;
          myImageData.data[(y + 1) * (myImageData.width * 4) + (x    ) * 4 + 3] += 255;
          myImageData.data[(y + 1) * (myImageData.width * 4) + (x + 1) * 4 + 3] += 255;
          */
  /*
          myImageData.data[(y    ) * (myImageData.width * 4) + (x + 4) * 4] += qErrNew * (7/16);
          myImageData.data[(y + 4) * (myImageData.width * 4) + (x - 4) * 4] += qErrNew * (3/16);
          myImageData.data[(y + 4) * (myImageData.width * 4) + (x    ) * 4] += qErrNew * (5/16);
          myImageData.data[(y + 4) * (myImageData.width * 4) + (x + 4) * 4] += qErrNew * (1/16);
          */
      }
  }

  console.log(myImageData);
  canvasRen.width = myImageData.width;
  canvasRen.height = myImageData.height;
  ctx.putImageData(myImageData, 0, 0);

  var end = Date.now();
  console.log(`Execution time: ${end - start} ms`);

}

