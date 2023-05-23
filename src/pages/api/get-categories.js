// api/get-categories.js
import mongoose from "mongoose";
import Category from "../../../schemas/Category";

export default async function handler(req, res) {
  const { method } = req;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  switch (method) {
    case "GET":
      try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
      } catch (error) {
        console.error("DB error:", error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
