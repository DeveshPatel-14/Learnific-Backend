import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import RazorPay from "razorpay";
import nodeCron from "node-cron";
import { Stats } from "./models/Stats.js";
import cors from 'cors'
import path from 'path'
import express from 'express'

connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

export const instance = new RazorPay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

nodeCron.schedule("0 0 0 5 * *", async () => {
  try {
    await Stats.create({});
  } catch (error) {
    console.log(error);
  }
});

// const temp = async()=>{await Stats.create({});}

// temp();

const __dirname = path.resolve();
app.use(express.static(path.resolve(__dirname, 'build')));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
const root = path.join(__dirname,'build')
app.use(express.static(root))

app.get('*', (req, res) =>
  res.sendFile(path.resolve('build', 'index.html'))
);


app.listen(process.env.PORT, () => {
  console.log(`Server is working on port: ${process.env.PORT}`);
});

