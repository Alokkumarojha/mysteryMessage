import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = conn.connections[0].readyState;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);

    throw new Error("MongoDB connection failed"); //
  }
}

export default dbConnect;
