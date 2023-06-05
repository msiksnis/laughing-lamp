// pages/api/get-services.js
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

  let searchString = req.query.search;
  let searchArray = searchString.split(" ").filter((word) => word);

  switch (method) {
    case "GET":
      try {
        let services;
        if (searchString.trim() !== "" && searchArray.length > 0) {
          let searchQuery = [];
          searchArray.forEach((word) => {
            let orQuery = [
              { title: { $regex: word, $options: "i" } },
              { description: { $regex: word, $options: "i" } },
              {
                "category.categoryName": { $regex: word, $options: "i" },
              },
            ];

            // Add gender to search query if it exactly matches "male" or "female"
            if (
              word.toLowerCase() === "male" ||
              word.toLowerCase() === "female"
            ) {
              orQuery.push({ gender: word.toLowerCase() });
            }

            searchQuery.push({ $or: orQuery });
          });

          services = await Service.aggregate([
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
              },
            },
            { $unwind: "$category" },
            {
              $match: {
                $and: searchQuery,
              },
            },
          ]);
        } else {
          services = [];
        }

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
