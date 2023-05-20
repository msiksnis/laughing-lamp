import mongoose from "mongoose";
import slugify from "slugify";

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    order: { type: Number },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    imageUrl: String,
    description: String,
    gender: { type: String, enum: ["male", "female"], required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

ServiceSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

let Service;

if (mongoose.models.Service) {
  Service = mongoose.model("Service");
} else {
  Service = mongoose.model("Service", ServiceSchema);
}

export default Service;
