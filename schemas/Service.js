import mongoose from "mongoose";
import slugify from "slugify";

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    imageUrl: String,
    description: String,
    category: {
      type: String,
      enum: ["manicure", "pedicure", "skin-care", "hair-removal"],
      required: true,
    },
    gender: { type: String, enum: ["male", "female"], required: true },
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
