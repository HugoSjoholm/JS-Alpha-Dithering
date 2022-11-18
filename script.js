//super viktigt
//https://www.construct.net/en/forum/construct-2/how-do-i-18/solved-imagedata-139293


let myImageData;



async function hmm(wait, imageAA) {
  let tmp;
  convertURIToImageData(imageAA).then(function(imageData) {
    tmp = imageData;
  });



  
  await new Promise(r => setTimeout(r, wait/3000));


  const canvasRen = document.getElementById("canvas-rendered");
  const ctx = canvasRen.getContext("2d");


  myImageData = ctx.createImageData(tmp);
  myImageData =  tmp;

  console.log('----------------');
  console.log(myImageData);

  var start = Date.now();


  let tmpCol;
  let currentPixelPos;
  let currentPixel;

  for (let y = 0; y < myImageData.height - 1; y++ ) {

      for (let x = 0; x < myImageData.width - 1; x++) {


          currentPixelPos = y * (myImageData.width * 4) + x * 4; //current position for the current pixel in the image data array
          currentPixel = [
            myImageData.data[currentPixelPos],
            myImageData.data[currentPixelPos + 1],
            myImageData.data[currentPixelPos + 2],
            myImageData.data[currentPixelPos + 3],
          ];

          //new pixel is the pixel colors quantized/"limited colors"/"crushed colors"
          let newPixel = [ 
            255 * Math.round(myImageData.data[currentPixelPos]/255),
            255 * Math.round(myImageData.data[currentPixelPos + 1]/255),
            255 * Math.round(myImageData.data[currentPixelPos + 2]/255),
            255 * Math.round(myImageData.data[currentPixelPos + 3]/255),
            
          ];

          //saves the quantized pixel to the canvas and then gets the Quantized error/differance between the original pixel and the quantized pixel
          SetPixel(x,y,newPixel); 
          let qErr = GetErr(currentPixel, newPixel);
          
          
          //""copied"" from C#
          tmpCol = GetPixel(x + 1, y    , myImageData);
          SetPixel(x + 1, y    ,[
             clampCol(tmpCol[0] + qErr[0] * (7 / 16)), //r
             clampCol(tmpCol[1] + qErr[1] * (7 / 16)), //g
             clampCol(tmpCol[2] + qErr[2] * (7 / 16)), //b
             clampCol(tmpCol[3] + qErr[3] * (7 / 16)) //a
          ]); 
          
          //tmp logging of the qErr and the color after the first step in the algoritem
          /*tmpCol = GetPixel(x + 1,y, myImageData);
          if (x < 70 && y < 120) {
            console.log("x: " + x + " y: " + y + " - Color: " + tmpCol + " - qErr: " + qErr)
          }*/
          

          tmpCol = GetPixel(x - 1, y + 1, myImageData);
          SetPixel(x - 1, y + 1,[
             clampCol(tmpCol[0] + qErr[0] * (3 / 16)),
             clampCol(tmpCol[1] + qErr[1] * (3 / 16)),
             clampCol(tmpCol[2] + qErr[2] * (3 / 16)),
             clampCol(tmpCol[3] + qErr[3] * (3 / 16))
          ]);

          tmpCol = GetPixel(x    , y + 1,myImageData);
          SetPixel(x    , y + 1,[
             clampCol(tmpCol[0] + qErr[0] * (5 / 16)),
             clampCol(tmpCol[1] + qErr[1] * (5 / 16)),
             clampCol(tmpCol[2] + qErr[2] * (5 / 16)),
             clampCol(tmpCol[3] + qErr[3] * (5 / 16))
          ]);

          tmpCol = GetPixel(x + 1, y + 1,myImageData);
          SetPixel(x + 1, y + 1,[
             clampCol(tmpCol[0] + qErr[0] * (1 / 16)),
             clampCol(tmpCol[1] + qErr[1] * (1 / 16)),
             clampCol(tmpCol[2] + qErr[2] * (1 / 16)),
             clampCol(tmpCol[3] + qErr[3] * (1 / 16))
          ]);
          
          //quick fix for alpha always bein 0??? this just hard codes all the alpha to being 255
          myImageData.data[(y) * (myImageData.width * 4) + (x ) * 4 + 3] = 255;
          
      }
  }

  console.log(myImageData);
  canvasRen.width = myImageData.width;
  canvasRen.height = myImageData.height;
  ctx.putImageData(myImageData, 0, 0);

  var end = Date.now();
  console.log(`Execution time: ${end - start} ms`);

}








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
  console.log(reader.result.length);
  hmm(reader.result.length, uploaded_image);
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








//old


//JS implumentation
/*
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
            
            */
          