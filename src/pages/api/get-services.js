// src/pages/api/get-services.js
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { method } = req;

  const db = await connectToDatabase();

  switch (method) {
    case "GET":
      try {
        const services = await db.collection("services").find({}).toArray();
        res.status(200).json({ success: true, data: services });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
