// api/get-skinCare.js
import mongoose from "mongoose";
import Service from "../../../schemas/Service";

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
        const skinCareServices = await Service.find({ category: "skin-care" });
        console.log("Skin Care Services from DB:", skinCareServices);
        res.status(200).json({ success: true, data: skinCareServices });
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
