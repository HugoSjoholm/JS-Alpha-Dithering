function clampCol(value) {
    if (value < 0) {
      value = 0;
    } else if (value > 255) {
      value = 255;
    }
  
    return value;
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


function hmm(imageAA) {
  console.log(imageAA);



  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  
  ctx.putImageData(imageAA, 0, 0);


//  const myImageData = ctx.createImageData(1080, 1080);
  const myImageData = ctx.getImageData(0,0);
  let tmp = base64ToBuffer(imageAA);

  console.log('----------------');
  console.log(myImageData);
  

  var start = Date.now();
  
  
  for (let x = 0; x < myImageData.width - 1; x++) {
      for (let y = 0; y < myImageData.height - 1; y++) {
          /*const pixel = ctx.getImageData(x, y, 1, 1).data;
          pixel[0] = x;
          pixel[1] = y;
          pixel[2] = 255;
          pixel[3] = 255;
          newIMG.push(pixel);*/
          myImageData.data[y * (myImageData.width * 4) + x * 4 + 0] = x;
          myImageData.data[y * (myImageData.width * 4) + x * 4 + 1] = y;
          myImageData.data[y * (myImageData.width * 4) + x * 4 + 2] = 255;
          myImageData.data[y * (myImageData.width * 4) + x * 4 + 3] = 255;
  
      }
  }
  canvas.width = myImageData.width;
  canvas.height = myImageData.height;
  ctx.putImageData(myImageData, 0, 0);

  var end = Date.now();
  console.log(`Execution time: ${end - start} ms`);

}

