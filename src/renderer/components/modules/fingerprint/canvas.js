function generateCanvas(width = 220, height = 30) {
  var canvas = document.createElement('canvas')
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");

  function randNumb(max) {
    return Math.floor(Math.random() * max);
  }

  function drawRect() {
    let x = randNumb(width);
    let y = randNumb(height);
    let wid = randNumb(width - x);
    let hei = randNumb(height - y);
    ctx.fillRect(x, y, wid, hei);
  }

  function clearRect() {
    let x = randNumb(width);
    let y = randNumb(height);
    let wid = randNumb(width - x);
    let hei = randNumb(height - y);
    ctx.clearRect(x, y, wid, hei);
  }

  for (let i = 0; i < randNumb(10); i++) drawRect();
  for (let i = 0; i < randNumb(10); i++) clearRect();

  return canvas.toDataURL();
}

export {
    generateCanvas
}
