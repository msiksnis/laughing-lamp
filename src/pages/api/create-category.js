// pages/api/create-category.js
import connectToDatabase from "../../../lib/mongodb";
import Category from "../../../schemas/Category";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case "POST":
      try {
        const category = new Category(req.body);
        await category.save();
        res.status(200).json({ success: true, data: category });
      } catch (error) {
        console.error("DB error:", error);
        if (error.name === "ValidationError") {
          res.status(400).json({ success: false, message: error.message });
        } else {
          res.status(500).json({ success: false });
        }
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
