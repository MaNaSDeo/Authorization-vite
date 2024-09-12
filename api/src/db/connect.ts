import mongoose from "mongoose";

const connectDB = async (url: string): Promise<typeof mongoose> => {
  //Returns a Promise that resolves with the mongoose object.
  //Promise is used because connecting to a database is an asynchronous operation.
  // mongoose.connect(url) returns a Promise
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to DataBase...");
      return mongoose;
    })
    .catch((err: Error) => {
      console.log(err);
      process.exit(1);
    });
};

export default connectDB;
