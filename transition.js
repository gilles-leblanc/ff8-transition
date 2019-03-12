let canvas;
let context;
let imageData;
const buffer = [];

var whithen = function(timestamp) {
  let t0 = performance.now();

  for (let i = 0; i < imageData.data.length; i++) {
    imageData.data[i] += 1;    
  }
  
  context.putImageData(imageData, 0, 0);
  let t1 = performance.now();
  console.log((t1 - t0) + " milliseconds.");

  if (imageData.data[0] < 250) {
    window.requestAnimationFrame(whithen); 
  }      
};

// turn one white line a certain color
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
  
  // turn screen to white
    // pick left or right side
    // from starting side to other side, starting side gets brighter faster from starting side up until white

  // when almost all white, start transforming to black instantly on the same side and each line at different speeed goes black to the opposing side
    // start black at about 80% to 90% done on each line. 
    // all lines do not go to same speed

  // process has not 100% finished when this happens
  // turn white screen to black

  // fade all to black

  // fade in to new image
});
