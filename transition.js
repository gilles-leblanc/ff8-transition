
const ff8 = function(context, canvas) {
  const drawPoint = function (x, y, colour) {
      context.beginPath();
      context.arc(x, y, 1, 0, 2 * Math.PI, true);
      context.fillStyle = colour;
      context.fill();
  }

  return {
    whiten: function (lineNumber) {
      for (let x = 0; x < canvas.width; x++) {
        drawPoint(x, lineNumber, 'white');          
      }      
    }
  }  
};

// turn one white line a certain color


window.addEventListener("load", function(){
  const canvas = document.getElementById('main-canvas');
  const context = canvas.getContext('2d');
  
  context.fillStyle = 'green';
  context.fillRect(0, 0, canvas.width, canvas.height);

  transition = ff8(context, canvas);
  transition.whiten(100);

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
