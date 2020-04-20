
import { fabric } from 'fabric';

let canvas = new fabric.Canvas('mainCanvas');
canvas.selection = false;

let polygonSides: fabric.Line[] = [];
let currentLine: fabric.Line;
let startingPoint: fabric.Circle = null;
let lineBeingDrawn = () => startingPoint !== null; 
let videoRendered = false;

canvas.on('mouse:down', (e) => { 
  console.log("clicked");
  let {x, y} = canvas.getPointer(e.e);

  if (!videoRendered) return;

  if (!lineBeingDrawn()) {
    startingPoint = new fabric.Circle({
      left: x,
      top: y,
      radius: 8,
      strokeWidth: 1,
      stroke: 'black',
      fill: 'white',
      originX: 'center',
      originY: 'center',
      selectable: false
    });
    canvas.add(startingPoint);
  }

  if (e.target == startingPoint) {
    // TODO: render complete polygon ?
    currentLine.set('x2', e.target.left);
    currentLine.set('y2', e.target.top);

    canvas.remove(startingPoint) // undisplay point
    startingPoint = null; // reset point
    return; 
  }

  currentLine = new fabric.Line([x,y,x,y], {
    stroke: 'red',
    strokeWidth: 3,
    selectable: false
  });
  polygonSides.push(currentLine);
  canvas.add(currentLine);
  canvas.renderAll();
});

canvas.on('mouse:move', (e) => {
  if (lineBeingDrawn()) {
    let {x, y} = canvas.getPointer(e.e);
    currentLine.set('x2', x);
    currentLine.set('y2', y);
    canvas.renderAll();
  }
});

async function extractFrameURLsFromVideo(videoUrl, fps=4) {
  let htmlCanvas: HTMLCanvasElement = document.getElementById("mainCanvas");
  let context = htmlCanvas.getContext('2d');
  return new Promise(async (resolve) => {
    // fully download it first (no buffering):
    let videoBlob = await fetch(videoUrl).then(r => r.blob());
    let videoObjectUrl = URL.createObjectURL(videoBlob);
    let video = document.createElement("video");

    let seekResolve;
    video.addEventListener('seeked', async function() {
      if(seekResolve) seekResolve();
    });

    video.src = videoObjectUrl;

    // fix metadata bug on chromium based browsers (https://stackoverflow.com/q/38062864/993683)
    while((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2) {
      await new Promise(r => setTimeout(r, 1000));
      video.currentTime = 10000000*Math.random();
    }

    let duration = video.duration;
    let [w, h] = [video.videoWidth, video.videoHeight];
    htmlCanvas.width =  1280;
    htmlCanvas.height = 720;

    let frameFabricImgs = [];
    let interval = 1 / fps;
    let currentTime = 0;

    while(currentTime < duration) {
      video.currentTime = currentTime;
      await new Promise(r => seekResolve=r);

      context.drawImage(video,0,0)

      let currentFrameURL = htmlCanvas.toDataURL();

      let currentImg = new Image();
      currentImg.onload = () => {
        let fabricImg = new fabric.Image(currentImg);
        canvas.setBackgroundImage(fabricImg, () => {});
        frameFabricImgs.push(fabricImg);
        canvas.renderAll();
      }

      currentImg.src = currentFrameURL;

      currentTime += interval;
    }
    context.resetTransform();
    resolve(frameFabricImgs);
  });
};


let slider = document.getElementById('frameRange');
let frameImgs = [];

let inputNode: HTMLInputElement = document.querySelector('#fileInput');
inputNode.oninput = async () => {
  document.getElementById("status-label").innerHTML = "Video loading..."
  let fileURL = URL.createObjectURL(inputNode.files[0]);
  extractFrameURLsFromVideo(fileURL).then((imgs) => {
    frameImgs = imgs;
    slider.setAttribute("max", (frameImgs.length-1).toString());
    slider.setAttribute("value", 0);
    videoRendered = true;
    document.getElementById("status-label").innerHTML = "Video loaded successfully."
    canvas.setBackgroundImage(frameImgs[0], () => { });
  });
}

slider.oninput = () => {
  if (!videoRendered) return;
  document.getElementById("status-label").innerHTML = `${parseInt(slider.value) + 1}/${frameImgs.length}`;
  canvas.setBackgroundImage(frameImgs[slider.value], () => {});
  canvas.renderAll();
}