// src/pages/api/create-service.js
import connectToDatabase from "../../../lib/mongodb";
import Service from "../../../schemas/Service";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case "POST":
      try {
        const service = new Service(req.body);
        await service.save();
        res.status(200).json({ success: true, data: service });
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
