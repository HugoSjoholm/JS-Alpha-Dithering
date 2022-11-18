//super viktigt
//https://www.construct.net/en/forum/construct-2/how-do-i-18/solved-imagedata-139293


let myImageData;



async function hmm(wait, imageAA) {
  let imageData;
  convertURIToImageData(imageAA).then(function(tmp) {
    imageData = tmp;
  });


  let newWait = wait / 440000 + 10;
  

  console.log(newWait);
  await new Promise(r => setTimeout(r, newWait ));

  const canvasRen = document.getElementById("canvas-rendered");
  const ctx = canvasRen.getContext("2d");


  myImageData = ctx.createImageData(imageData);
  myImageData =  imageData;

  let myImageDataCopy = ctx.createImageData(imageData);
  myImageDataCopy = imageData;
  
  console.log('----------------');
  console.log(myImageData);
  
  await new Promise(r => setTimeout(r, 15000));


  //console.log(myImageDataCopy);
  var start = Date.now();
  let tmpCol;
  let currentPixelPos;
  let currentPixel;
  let qErr;

  for (let y = 0; y < myImageData.height - 1; y++ ) {

      for (let x = 0; x < myImageData.width - 1; x++) {

        /*
        currentPixel = GetPixel(x,y,myImageDataCopy);


        tmpCol = GetPixel(x + 1,y, myImageData);
          if (x < 70 && y < 120) {
            console.log("x: " + x + " y: " + y + " - CurrentPixel: " + currentPixel + " - myImageData: " + [
            myImageData.data[(y) * (myImageData.width * 4) + (x) * 4],
            myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 1],
            myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 2],
            myImageData.data[(y) * (myImageData.width * 4) + (x) * 4 + 3]])
          } 
*/

        
          currentPixelPos = y * (myImageData.width * 4) + x * 4;
          
          currentPixel = GetPixel(x,y,myImageDataCopy);
          if (x < 70 && y < 120)
            console.log(currentPixel);

          const avragedCol = AvrageColor([
            myImageData.data[currentPixelPos],
            myImageData.data[currentPixelPos + 1],
            myImageData.data[currentPixelPos + 2]
          ]);

          let newPixel = [
            255 * Math.round(currentPixel[0]/255),
            255 * Math.round(currentPixel[1]/255),
            255 * Math.round(currentPixel[2]/255),
            255 * Math.round(currentPixel[3]/255),
          ];

          //SetPixel(x,y,newPixel);

          qErr = GetErr(currentPixel, newPixel);
          

          if(currentPixel[3] < 255) {

            //the algorithem

            //""copied"" from C#
            tmpCol = GetPixel(x + 1, y    , myImageDataCopy);
            SetPixel(x + 1, y    ,[
              tmpCol[0], //r
              tmpCol[1], //g
              tmpCol[2], //b
              clampCol(tmpCol[3] + qErr[3] * (7 / 16)) //a
            ]); 
            
            tmpCol = GetPixel(x + 1,y, myImageDataCopy);
            if (x < 70 && y < 120) {
              console.log("x: " + x + " y: " + y + " - CurrentPixel: " + currentPixel + " - myImageData: " + [
              myImageDataCopy.data[currentPixelPos],
              myImageDataCopy.data[currentPixelPos + 1],
              myImageDataCopy.data[currentPixelPos + 2],
              myImageDataCopy.data[currentPixelPos + 3]])
            } 

            tmpCol = GetPixel(x - 1, y + 1, myImageDataCopy);
            SetPixel(x - 1, y + 1,[
              tmpCol[0],
              tmpCol[1],
              tmpCol[2],
              clampCol(tmpCol[3] + qErr[3] * (3 / 16))
            ]);

            tmpCol = GetPixel(x    , y + 1,myImageDataCopy);
            SetPixel(x    , y + 1,[
              tmpCol[0],
              tmpCol[1],
              tmpCol[2],
              clampCol(tmpCol[3] + qErr[3] * (5 / 16))
            ]);

            tmpCol = GetPixel(x + 1, y + 1,myImageDataCopy);
            SetPixel(x + 1, y + 1,[
              tmpCol[0],
              tmpCol[1],
              tmpCol[2],
              clampCol(tmpCol[3] + qErr[3] * (1 / 16))
            ]);
        }
        else {

            console.log('????');
          


          tmpCol = GetPixel(x,y,myImageDataCopy);
          SetPixel(x,y,[
            tmpCol[0],
            tmpCol[1],
            tmpCol[2],
            255
          ]);
        }
          //myImageData.data[(y) * (myImageData.width * 4) + (x ) * 4 + 3] = 255;
          
      }
  }

  console.log(myImageDataCopy);
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
  return clampCol((arr[0] + arr[1] + [2])/3);
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
          