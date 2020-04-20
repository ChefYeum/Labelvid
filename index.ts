import express from "express";
import video from "./routes/api/video";
import connectDB from "./database/connection";

const app = express();
const port = 8090;

connectDB();
app.use(express.static('client/dist'));
app.use("/api/video", video);

app.listen(port, () => {
  console.log( `Server started at http://localhost:${port}`);
});