import express from "express";
import video from "./routes/api/video";

const app = express();
const port = 8090;

app.use(express.static('client'));
app.use("/api/video", video);

app.listen(port, () => {
  console.log( `Server started at http://localhost:${port}`);
});