// pages/api/edit-treatment/[id].js
import connectToDatabase from "../../../../lib/mongodb";
import Service from "../../../../schemas/Service";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case "PUT":
      try {
        const id = req.query.id;
        const service = await Service.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!service) {
          return res
            .status(404)
            .json({ success: false, message: "Service not found." });
        }

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
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
