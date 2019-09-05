const sideEnum = Object.freeze({"left": 1, "right": -1});
const pass = Object.freeze({"first": 1, "second": 2});

let context;
let imageData;
const numberOfIndicesPerPixel = 4;
const xProgress = [];
const onColor = 255;
const offColor = 0;
let height, width, segmentLength, sideMultiplier, initialX, lineHeight;
let numberOfFramesRan;

const config = {
  color: onColor,
  currentPass: pass.first,
  direction: sideEnum.left,  
  frameLimitFactor: 1,        
  horizontalSegments: 10,
  initSpread: 0.2,
  lineHeight: 4,
}

var initTransition = function() {
  xProgress.length = 0;
  const spread = width * config.initSpread;
  const lineHeight = config.lineHeight;
  const color = config.color;
  const colorAsText = color === 0 ? 'black' : 'white';
  const canvasInitialX = Math.ceil(initialX / numberOfIndicesPerPixel);
  
  context.fillStyle = colorAsText;
  
  for (let y = 0; y < height; y += lineHeight) {      
    let numberOfPixelsToInit = Math.floor(Math.random() * spread);

    for (let z = 0; z < lineHeight; z++) {
      xProgress.push(numberOfPixelsToInit);    

      for (let x = 0; x <= numberOfPixelsToInit; x++) {
        imageData.data[(y + z) * width + (initialX + x * sideMultiplier)] = color;
      }  
    }    
    
    context.fillRect(canvasInitialX, y, sideMultiplier * numberOfPixelsToInit / numberOfIndicesPerPixel, lineHeight);
  }
}

var colorSwoosh = function(timestamp) {  
  const color = function(passMultiplier) {
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
    color(config.currentPass === pass.first ? 1 : -1);    
  }   
  
  const lastValueToCheck = config.direction === sideEnum.right ? 1 : imageData.data.length - numberOfIndicesPerPixel;
  numberOfFramesRan++;

  if (config.currentPass === pass.first) {
    if (numberOfFramesRan < 100 && imageData.data[lastValueToCheck] < config.color) {
      requestAnimationFrame(colorSwoosh); 
    } else {
      config.color = offColor;
      config.currentPass = pass.second;
      config.frameLimitFactor = 1;
      initTransition();
      requestAnimationFrame(colorSwoosh);

      setTimeout(() => {
        document.getElementById('start-button').disabled = false;
      }, 2000);
    }  
  } else {
    if (imageData.data[lastValueToCheck] > config.color) {
      requestAnimationFrame(colorSwoosh);
    }
  }
};

addEventListener("load", function() {
  const canvas = document.getElementById('main-canvas');
  startButton = document.getElementById('start-button');
  
  const canvasWidth = canvas.getBoundingClientRect().width;
  const canvasHeight = canvas.getBoundingClientRect().height;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context = canvas.getContext('2d', { alpha: false });
  context.fillStyle = "black";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  
  startButton.addEventListener('click', function() {
    numberOfFramesRan = 0;
    startButton.disabled = true;
    startButton.blur();
    config.color = onColor;   
    config.currentPass = pass.first;

    if (Math.floor(Math.random() * 2) === 0) {
      config.direction = sideEnum.right;
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
      sideMultiplier = config.direction === sideEnum.left ? 1 : -1;
      initialX = config.direction === sideEnum.left ? 0 : width - 1;  

      initTransition();
      requestAnimationFrame(colorSwoosh);
    }, 1000);    
  });

  // see https://www.youtube.com/watch?v=9RoHMNXE6YM&t=31s
});
