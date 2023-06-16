import mongoose from "mongoose";

const GiftCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    order: { type: Number },
    price: { type: Number, required: true },
    imageUrl: String,
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

let GiftCard;

if (mongoose.models.GiftCard) {
  GiftCard = mongoose.model("GiftCard");
} else {
  GiftCard = mongoose.model("GiftCard", GiftCardSchema);
}

export default GiftCard;
