// api/delete-item/[id].js
import connectToDatabase from "../../../../lib/mongodb";
// import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const id = req.query.id;

    try {
      await connectToDatabase();
      const db = mongoose.connection;
      const result = await db
        .collection("services")
        .deleteOne({ _id: new mongoose.Types.ObjectId(id) });

      if (!result.deletedCount) {
        // If no items were deleted
        return res.status(404).json({ message: "Item not found." });
      }

      return res.status(200).json({ message: "Item deleted successfully." });
    } catch (error) {
      console.error("Failed to delete item:", error.message);
      return res.status(500).json({
        error: "An error occurred while trying to delete the item.",
      });
    }
  } else {
    // If the request method is not DELETE
    res.status(405).json({ error: "Method not allowed. Use DELETE." });
  }
}
