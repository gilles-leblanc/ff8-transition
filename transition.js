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
let height, width, segmentLength, sideMultiplier, initialX, lineHeight;
let numberOfFramesRan;

const config = {
  color: onColor,
  currentPass: Pass.first,
  direction: SideEnum.left,  
  frameLimitFactor: 1,        
  horizontalSegments: 10,
  initSpread: 0.2,
  lineHeight: 4,
}

var initTransition = function() {
  xProgress = [];
  const spread = width * config.initSpread;

  for (let y = 0; y < height; y += config.lineHeight) {      
    let numberOfPixelsToInit = Math.floor(Math.random() * Math.floor(spread));

    for (let z = 0; z < config.lineHeight; z++) {
      xProgress.push(numberOfPixelsToInit);    

      for (let x = 0; x <= numberOfPixelsToInit; x++) {
        imageData.data[(y + z) * width + (initialX + x * sideMultiplier)] = config.color;
      }    
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

  if (config.frameLimitFactor === 0 || Math.floor(timestamp % config.frameLimitFactor) === 0) {
    color(config.currentPass === Pass.first ? 1 : -1);    
  }   
  
  const lastValueToCheck = config.direction === SideEnum.right ? 1 : imageData.data.length - numberOfIndicesPerPixel;
  numberOfFramesRan++;

  if (config.currentPass === Pass.first) {
    if (numberOfFramesRan < 100 && imageData.data[lastValueToCheck] < config.color) {
      window.requestAnimationFrame(colorSwoosh); 
    } else {
      config.color = offColor;
      config.currentPass = Pass.second;
      config.frameLimitFactor = 1;
      initTransition();
      window.requestAnimationFrame(colorSwoosh);

      setTimeout(() => {
        document.getElementById('start-button').disabled = false;
      }, 1000);
    }  
  } else {
    if (imageData.data[lastValueToCheck] > config.color) {
      window.requestAnimationFrame(colorSwoosh);
    }
  }
};

window.addEventListener("load", function() {
  canvas = document.getElementById('main-canvas');
  startButton = document.getElementById('start-button');
  
  const canvasWidth = canvas.getBoundingClientRect().width;
  const canvasHeight = canvas.getBoundingClientRect().height;
  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);

  context = canvas.getContext('2d', { alpha: false });
  context.fillStyle = "black";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  
  startButton.onclick = function() {
    numberOfFramesRan = 0;
    startButton.disabled = true;
    startButton.blur();
    config.color = onColor;   
    config.currentPass = Pass.first;

    if (Math.floor(Math.random() * 2) === 0) {
      config.direction = SideEnum.right;
    }

    config.frameLimitFactor = +document.getElementById('frameSkip').value;
    config.horizontalSegments = +document.getElementById('segmentation').value;
    config.initSpread = +document.getElementById('initSpread').value;
    config.lineHeight = +document.getElementById('lineHeight').value;

    if (document.documentElement.clientWidth <= 800) {
      config.lineHeight = 2;
    }

    context.drawImage(document.getElementById('ff8'), 0, 0, canvasWidth, canvasHeight);

    setTimeout(() => {
      imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);

      width = imageData.width * numberOfIndicesPerPixel;  
      height = imageData.height;
      segmentLength = width / config.horizontalSegments;
      sideMultiplier = config.direction === SideEnum.left ? 1 : -1;
      initialX = config.direction === SideEnum.left ? 0 : width - 1;  

      initTransition();
      window.requestAnimationFrame(colorSwoosh);
    }, 1000);    
  };

  // see https://www.youtube.com/watch?v=9RoHMNXE6YM&t=31s
});
