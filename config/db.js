import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://jagdishkumarsingh2023:Sonusingh15@cluster0.bdiiw.mongodb.net/food-del"
    )
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err)); // This was incorrectly inside the .then()
};
