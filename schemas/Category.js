import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

let Category;

if (mongoose.models.Category) {
  Category = mongoose.model("Category");
} else {
  Category = mongoose.model("Category", CategorySchema);
}

export default Category;
