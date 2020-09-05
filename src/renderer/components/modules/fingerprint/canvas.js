import { setDefaults } from "../utils";

export class CanvasGenerator {
  constructor() {
    this.options = {
      width: 220,
      height: 30,
    };
  }

  Alone() {
    let options = this.options;
    var canvas = document.createElement("canvas");
    canvas.width = this.options.width;
    canvas.height = this.options.height;
    var ctx = canvas.getContext("2d");

    function randNumb(max) {
      return Math.floor(Math.random() * max);
    }

    function drawRect() {
      let x = randNumb(options.width);
      let y = randNumb(options.height);
      let wid = randNumb(options.width - x);
      let hei = randNumb(options.height - y);
      ctx.fillRect(x, y, wid, hei);
    }

    function clearRect() {
      let x = randNumb(options.width);
      let y = randNumb(options.height);
      let wid = randNumb(options.width - x);
      let hei = randNumb(options.height - y);
      ctx.clearRect(x, y, wid, hei);
    }

    for (let i = 0; i < randNumb(10); i++) drawRect();
    for (let i = 0; i < randNumb(10); i++) clearRect();

    return canvas.toDataURL();
  }

  Array(count) {
    let result = [];
    for (let i = 0; i < count; i++) result.push(this.Alone());
    return result;
  }
}
