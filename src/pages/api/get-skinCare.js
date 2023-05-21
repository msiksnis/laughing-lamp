// api/get-skinCare.js
import mongoose from "mongoose";
import Service from "../../../schemas/Service";
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
        // Get the category from the database.
        const category = await Category.findOne({ categoryName: "skin-care" });

        if (!category) {
          throw new Error("Category not found.");
        }

        // Now use the category's ID to query the Service model.
        const services = await Service.find({ category: category._id }).sort({
          order: 1,
        });

        res.status(200).json({ success: true, data: services });
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
