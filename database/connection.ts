import { ConnectionOptions, connect } from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI: string = "mongodb+srv://admin:admin@labelvid-ksogc.mongodb.net/test?retryWrites=true&w=majority";
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    };
    await connect(
      mongoURI,
      options
    );
    console.log("MongoDB successfully connected to the cloud");
  } catch (err) {
    console.error(err);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
