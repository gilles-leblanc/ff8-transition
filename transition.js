const SideEnum = Object.freeze({"left": 1, "right": -1});
const Pass = Object.freeze({"first": 1, "second": 2});

let canvas;
let context;
let imageData;
const buffer = [];
const numberOfIndicesPerPixel = 4;
let xProgress = [];
const onColor = 255;
const offColor = 0;
let height, width, segmentLength, sideMultiplier, initialX;

const config = {
  direction: SideEnum.left,  
  frameLimitFactor: 1,        
  horizontalSegments: 10,
  initSpread: 0.2,
  color: onColor,
  currentPass: Pass.first,
}

var initTransition = function() {
  xProgress = [];
  const spread = width * config.initSpread;

  for (let y = 0; y < height; y++) {      
    let numberOfPixelsToInit = Math.floor(Math.random() * Math.floor(spread));
    xProgress.push(numberOfPixelsToInit);    

    for (let x = 0; x <= numberOfPixelsToInit; x++) {
      imageData.data[y * width + (initialX + x * sideMultiplier)] = config.color;
    }    
  }
  
  context.putImageData(imageData, 0, 0);
}

var colorSwoosh = function(timestamp) {  
  function color(passMultiplier) {
    const calcValueToAddFunc = function(x, segmentLength) {
      return config.horizontalSegments - Math.floor(x / segmentLength);
    }
    
    for (let y = 0; y < height; y++) {      
      for (let x = xProgress[y]; x <= width; x++) {      
        const valueToAdd = calcValueToAddFunc(x, segmentLength + xProgress[y]);
        imageData.data[y * width + (initialX + x * sideMultiplier)] += valueToAdd * passMultiplier;
      }
    }
    
    context.putImageData(imageData, 0, 0);
  }

  if (Math.floor(timestamp % config.frameLimitFactor) === 0) {
    color(config.currentPass === Pass.first ? 1 : -1);    
  }   
  
  const lastValueToCheck = config.direction === SideEnum.right ? 1 : imageData.data.length - 1;

  if (config.currentPass === Pass.first) {
    if (imageData.data[lastValueToCheck] < config.color) {
      window.requestAnimationFrame(colorSwoosh); 
    } else {
      config.color = offColor;
      config.currentPass = Pass.second;
      config.frameLimitFactor = 1;
      initTransition();
      window.requestAnimationFrame(colorSwoosh);
    }  
  } else {
    if (imageData.data[lastValueToCheck] > config.color) {
      window.requestAnimationFrame(colorSwoosh);
    }
  }
};

window.addEventListener("load", function() {
  canvas = document.getElementById('main-canvas');
  canvas.onclick = function() {
    context = canvas.getContext('2d', { alpha: false });
    imageData = context.createImageData(canvas.width, canvas.height);    
  
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.floor(Math.random() * 2) === 0) {
      config.direction = SideEnum.right;
    }

    width = imageData.width * numberOfIndicesPerPixel;  
    height = imageData.height;
    segmentLength = width / config.horizontalSegments;
    sideMultiplier = config.direction === SideEnum.left ? 1 : -1;
    initialX = config.direction === SideEnum.left ? 0 : width - 1;  

    initTransition();
    window.requestAnimationFrame(colorSwoosh);
  };

  // see https://www.youtube.com/watch?v=9RoHMNXE6YM&t=32s
});
