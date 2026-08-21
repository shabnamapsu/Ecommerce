import mongoose from "mongoose";

export const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.MGDB_URL);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};