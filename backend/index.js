const express = require("express");
// Imports the Google Cloud client library
const vision = require("@google-cloud/vision");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const fileUpload = require("express-fileupload");
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./resources/key.json";

app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
const uploadFile = require("./upload");

function ocr(filename) {
  return new Promise(async (resolve, reject) => {
    try {
      // Creates a client
      const client = new vision.ImageAnnotatorClient();
      // Performs text detection on the local file
      const [result] = await client.textDetection(filename);
      const detections = result.textAnnotations;
      const [text, ...others] = detections;
      console.log(`Text: ${text.description}`);
      resolve({ text: text.description });
    } catch (error) {
      reject(error);
    }
  });
}

app.get("/detectText", async (req, res) => {
  res.send("welcome to the homepage");
});

app.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let sampleFile = req.files.image;
  sampleFile.mv(`./uploads/${sampleFile.name}`, async function (err) {
    try {
      if (err) {
        throw new Error(err);
      }
      const result = await ocr(`./uploads/${sampleFile.name}`);
      res.send(result);
    } catch (e) {
      res.status(500).send(e);
    }
  });
});
//listen on port
app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});
