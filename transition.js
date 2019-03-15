const SideEnum = Object.freeze({"left": 1, "right": -1});

let canvas;
let context;
let imageData;
const buffer = [];
const _numberOfIndicesPerPixel = 4;

const config = {
  direction: SideEnum.left,  
  horizontalSegments: 10,
  frameLimitFactor: 1,        // 1 is normal speed
}

var calcValueToAddLeft = function(x, tenth) {
  return config.horizontalSegments - Math.floor(x / tenth);
}

var calcValueToAddRight = function(x, tenth) {
  return Math.floor(x / tenth);
}

var whithen = function(timestamp) {
  const lastValueToCheck = config.direction === SideEnum.right ? 0 : imageData.data.length - 1;
  if (Math.floor(timestamp % config.frameLimitFactor) === 0) {
    let t0 = performance.now();

    const width = imageData.width * _numberOfIndicesPerPixel;  
    const height = imageData.height;
    const tenth = width / config.horizontalSegments;    
    const calcValueToAddFunc = config.direction === SideEnum.left ? calcValueToAddLeft : calcValueToAddRight;
  
    for (let y = 0; y < height; y++) {      
      for (let x = 0; x < width; x++) {      
        const valueToAdd = calcValueToAddFunc(x, tenth);
  
        imageData.data[y * width + x] += valueToAdd;      
      }
    }
  
    context.putImageData(imageData, 0, 0);
    let t1 = performance.now();
    console.log((t1 - t0) + " milliseconds.");
  }   

  if (imageData.data[lastValueToCheck] < 250) {
    window.requestAnimationFrame(whithen); 
  }      
};

window.addEventListener("load", function() {
  canvas = document.getElementById('main-canvas');
  canvas.onclick = function() {
    context = canvas.getContext('2d', { alpha: false });
    imageData = context.createImageData(canvas.width, canvas.height);    
  
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    console.log(imageData);
    window.requestAnimationFrame(whithen);
  };
  
  // when almost all white, start transforming to black instantly on the same side and each line at different speeed goes black to the opposing side
    // start black at about 80% to 90% done on each line. 
    // all lines do not go to same speed

  // process has not 100% finished when this happens
  // turn white screen to black

  // fade all to black

  // fade in to new image
});
