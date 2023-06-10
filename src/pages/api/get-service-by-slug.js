// pages/api/get-service-by-slug.js
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
        const slug = req.query.slug;
        const service = await Service.findOne({ slug }).populate("category");

        if (!service) {
          res
            .status(404)
            .json({ success: false, message: "Service not found" });
          return;
        }

        const serviceData = service.toObject(); // convert mongoose document to plain JS object
        serviceData.categoryName = service.category.categoryName; // use 'categoryName' field

        res.status(200).json({ success: true, data: serviceData });
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
