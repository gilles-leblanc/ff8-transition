let canvas;
let context;
let imageData;
const buffer = [];

class Point {  
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, 1, 0, 2 * Math.PI, true);
    context.fillStyle =  `rgb(${this.red}, ${this.green}, ${this.blue})`;
    context.fill();
  }
}

var whithen = function(timestamp) {
  // let t0 = performance.now();

  for (let y = 0; y < imageData.height * 4; y++) {
    for (let x = 0; x < imageData.width * 4; x += 4) {
    //   // brighten to white at certain speed

    //   // draw point with new brightened colour

    //   // let point = buffer[y][x];
    //   // point.red += 10;
    //   // point.green += 10;
    //   // point.blue += 10;
      
    //   // point.draw(context);      
    //   // console.log(imageData.data[(y * imageData.width) + x]);
      // console.log(`y: ${y}, x: ${x}`);
      // console.log((y * imageData.width) + x, (y * imageData.width) + x + 1, (y * imageData.width) + x + 2, (y * imageData.width) + x + 3);

      imageData.data[(y * imageData.width) + x] += 1;
      imageData.data[(y * imageData.width) + x + 1] += 1;
      imageData.data[(y * imageData.width) + x + 2] += 1;
      imageData.data[(y * imageData.width) + x + 3] += 1;
    }        
  }

  // let t1 = performance.now();
  // console.log((t1 - t0) + " milliseconds.");
  context.putImageData(imageData, 0, 0);

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

    for (let y = 0; y < canvas.height; y++) {
      const line = [];
      
      for (let x = 0; x < canvas.width; x++) {
        line.push(new Point(x, y));
      }
  
      buffer.push(line);
    }
  
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
