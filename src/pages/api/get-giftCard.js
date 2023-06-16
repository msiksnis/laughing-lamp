// api/get-giftCard.js
import mongoose from "mongoose";
import GiftCard from "../../../schemas/GiftCard";
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
        const category = await Category.findOne({ categoryName: "gift-cards" });

        if (!category) {
          return res
            .status(404)
            .json({ success: false, error: "Category not found." });
        }

        // Now use the category's ID to query the GiftCard model.
        const giftCards = await GiftCard.find({ category: category._id }).sort({
          order: 1,
        });

        res.status(200).json({ success: true, data: giftCards });
      } catch (error) {
        console.error("DB error:", error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res
        .status(405)
        .json({ success: false, error: `Method ${method} Not Allowed` });
      break;
  }
}
