// pages/api/create-giftCard.js
import connectToDatabase from "../../../lib/mongodb";
import GiftCard from "../../../schemas/GiftCard";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case "POST":
      try {
        const giftCard = new GiftCard(req.body);
        await giftCard.save();
        res.status(200).json({ success: true, data: giftCard });
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
