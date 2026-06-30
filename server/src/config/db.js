// Import mongoose to talk to MongoDB
import mongoose from "mongoose";

// Connect to the MongoDB database using the URL from the .env file
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
