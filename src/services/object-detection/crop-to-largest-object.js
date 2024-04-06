require("@tensorflow/tfjs-backend-cpu");
require("@tensorflow/tfjs-backend-webgl");
const cocoSsd = require("@tensorflow-models/coco-ssd");

const { createCanvas, loadImage } = require("canvas");
const sizeOf = require("image-size");

async function cropToLargestObject(imageBase64) {
  const imageBase64Data = imageBase64.split(",")[1];
  const imageBytes = Buffer.from(imageBase64Data, "base64");
  const imageSize = sizeOf(imageBytes);

  if (!imageSize) {
    throw new Error('Invalid image data.');
  }

  const { width, height } = imageSize;
  const model = await cocoSsd.load();

  console.log("Model loaded for object detection.");

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(imageBase64);

  ctx.drawImage(image, 0, 0, width, height);

  const predictions = await model.detect(canvas);

  console.log("Detection completed with predictions:", predictions);

  if (predictions.length === 0) {
    console.log("No objects detected.");
    return imageBase64; // Return the original image if no objects detected
  }

  const cropBoundingBox = findLargestBoundingBox(predictions);

  return cropImage(canvas, cropBoundingBox);
}

function calculateArea([_, _, width, height]) {
  return width * height;
}

function cropImage(canvas, [x, y, width, height]) {
  const croppedCanvas = createCanvas(width, height);
  const croppedCtx = croppedCanvas.getContext("2d");

  croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
  const croppedBase64Image = croppedCanvas.toDataURL();

  console.log("Cropped image data:", croppedBase64Image.slice(0, 50));
  return croppedBase64Image;
}

function findLargestBoundingBox(predictions) {
  const largestBoundingBox = predictions.reduce((max, p) => (calculateArea(max.bbox) > calculateArea(p.bbox) ? max : p))
  return largestBoundingBox.bbox;
}

module.exports = cropToLargestObject;