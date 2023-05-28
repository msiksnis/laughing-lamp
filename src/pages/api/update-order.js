import mongoose from "mongoose";
import Service from "../../../schemas/Service";

export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  switch (req.method) {
    case "POST":
      try {
        const { orderedItems } = req.body;

        // Loop through each item in the order they were sent in
        for (let i = 0; i < orderedItems.length; i++) {
          const item = orderedItems[i];
          await Service.updateOne({ _id: item._id }, { order: i });
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.error("DB error:", error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
