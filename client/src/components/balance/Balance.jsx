import React from 'react'

const Balance = () => {
    const imageURL = 'http://server.speaking.odessa.ua/f43dfe06-6808-42c9-a0a7-7d895283811d.jpg';

    // the desired aspect ratio of our output image (width / height)
    const outputImageAspectRatio = 1;

    // this image will hold our source image data
    const inputImage = new Image();
    //inputImage.crossOrigin = "anonymous";

// we want to wait for our image to load
inputImage.onload = () => {
    // let's store the width and height of our image
    const inputWidth = inputImage.naturalWidth;
    const inputHeight = inputImage.naturalHeight;
    let skipX, skipY
    
    if(inputWidth > inputHeight){
        skipX = (inputWidth - inputHeight)/2;
        skipY = 0;
    }else{
        skipX = 0;
        skipY = (inputHeight - inputWidth)/2;
    }
    
    // get the aspect ratio of the input image
    const inputImageAspectRatio = inputWidth / inputHeight;
    
    // if it's bigger than our target aspect ratio
    let outputWidth = inputWidth;
    let outputHeight = inputHeight;
    
    if (inputImageAspectRatio > outputImageAspectRatio) {
        outputWidth = inputHeight * outputImageAspectRatio;        
    } else if (inputImageAspectRatio < outputImageAspectRatio) {
        outputHeight = inputHeight / outputImageAspectRatio;
    }

    // create a canvas that will present the output image
    const outputImage = document.createElement('canvas');

    // set it to the same size as the image
    outputImage.width = "250";
    outputImage.height = "250";
    
    // draw our image at position 0, 0 on the canvas
    const ctx = outputImage.getContext('2d');
    ctx.drawImage(inputImage, skipX, skipY, outputWidth, outputHeight, 0, 0, 200, 200);


    // var newImage = new Image();
    // newImage.crossOrigin="anonymous"

    // newImage.src = outputImage.toDataURL("image/png");

    // document.body.appendChild(newImage);
    console.log(outputImage)
    //console.log(newImage)

    // show both the image and the canvas
    //document.body.appendChild(inputImage);
    document.body.appendChild(outputImage);

        var canvasData = outputImage.toDataURL("image/jpeg");
        
        alert(canvasData);

    //он не успевает загрузится и поэтому пустой
    //нужно делать через filereader скорее всего        

        document.getElementById('ava-new').src="/canvasData";
        //console.log(outputImage)
        

    // outputImage.toBlob(
    //     blob => {
    //       const anchor = document.createElement('a');
    //       anchor.download = 'my-file-name.jpg'; // optional, but you can give the file a name
    //       anchor.href = URL.createObjectURL(blob);
      
    //       anchor.click(); // ✨ magic!
      
    //       URL.revokeObjectURL(anchor.href); // remove it from memory and save on memory! 😎
    //     },
    //     'image/jpeg',
    //     0.9,
    //   );

    // outputImage.toBlob((blob) => {
    //     const newImg = document.createElement('img');
    //     const url = URL.createObjectURL(blob);
      
    //     newImg.onload = () => {
    //       // no longer need to read the blob so it's revoked
    //       URL.revokeObjectURL(url);
    //     };
    //     newImg.crossOrigin = "anonymous";
    //     newImg.src = url + "?not-from-cache-please";
    //     //corsImageModified.src = url + "?not-from-cache-please";
        
    //     document.body.appendChild(newImg);
    //   });

    
};

// start loading our image
inputImage.src = imageURL;

    return (
        <div id='picture'>
            
            <img src={imageURL} width='200px' height='250px' alt='' />
            <img id='ava-new' width='200px' height='200px' alt=''/>
        </div>
    )
}

export default Balance