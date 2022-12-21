import mongoose from "mongoose";

export default async function dbConn() {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected");
    return;
  }

  await mongoose.connect(process.env.DATABASE_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log("Connected to MongoDB");
}
