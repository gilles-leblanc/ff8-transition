const SideEnum = Object.freeze({"left": 1, "right": -1});

let canvas;
let context;
let imageData;
const buffer = [];
const _numberOfIndicesPerPixel = 4;
const xProgress = [];

const config = {
  direction: SideEnum.left,  
  frameLimitFactor: 1,        // 1 is normal speed  
  horizontalSegments: 10,
  initSpread: 0.2,
  onColor: 255,
  offColor: 0,
}

var initTransition = function() {
  const width = imageData.width * _numberOfIndicesPerPixel;  
  const height = imageData.height;
  const spread = width * config.initSpread;
  
  for (let y = 0; y < height; y++) {      
    let numberOfPixelsToInit = Math.floor(Math.random() * Math.floor(spread));
    xProgress.push(numberOfPixelsToInit);
    for (let x = 0; x < numberOfPixelsToInit; x++) {
      imageData.data[y * width + x] = config.onColor;
    }    
  }
  
  context.putImageData(imageData, 0, 0);
}

var calcValueToAddLeft = function(x, segmentValue) {
  return config.horizontalSegments - Math.floor(x / segmentValue);
}

var calcValueToAddRight = function(x, segmentValue) {
  return Math.floor(x / segmentValue);
}

var whithen = function(timestamp) {
  const lastValueToCheck = config.direction === SideEnum.right ? 0 : imageData.data.length - 1;
  if (Math.floor(timestamp % config.frameLimitFactor) === 0) {
    let t0 = performance.now();

    const width = imageData.width * _numberOfIndicesPerPixel;  
    const height = imageData.height;
    const segmentValue = width / config.horizontalSegments;    
    const calcValueToAddFunc = config.direction === SideEnum.left ? calcValueToAddLeft : calcValueToAddRight;
  
    for (let y = 0; y < height; y++) {      
      for (let x = xProgress[y]; x < width; x++) {      
        const valueToAdd = calcValueToAddFunc(x, segmentValue + xProgress[y]);
        imageData.data[y * width + x] += valueToAdd;      
      }
    }
  
    context.putImageData(imageData, 0, 0);
    let t1 = performance.now();
    console.log((t1 - t0) + " milliseconds.");
  }   

  if (imageData.data[lastValueToCheck] < config.onColor) {
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

    initTransition();
    window.requestAnimationFrame(whithen);
  };
  
  // start at current completion when whithening
  // speed of line could be relative to init completion ???  
  // splotching effect see https://www.youtube.com/watch?v=9RoHMNXE6YM&t=32s

  // darken 

  // when almost all white, start transforming to black instantly on the same side and each line at different speeed goes black to the opposing side
    // start black at about 80% to 90% done on each line. 
    // all lines do not go to same speed

  // process has not 100% finished when this happens
  // turn white screen to black

  // fade all to black

  // fade in to new image
});
