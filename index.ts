import express from "express";
import video from "./routes/api/video";
import connectDB from "./database/connection";

const app = express();
const port = 8090;

connectDB();
app.use(express.static('client'));
app.use("/api/video", video);

app.listen(port, () => {
  console.log( `Server started at http://localhost:${port}`);
});

// mongodb+srv://admin:admin@labelvid-ksogc.mongodb.net/test?retryWrites=true&w=majority