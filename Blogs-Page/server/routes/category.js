const router = require("express").Router();
const Category = require("../models/Category");

// CREATE a new category
router.post("/", async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// READ all categories
router.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json(err);
  }
});

// READ a single category by ID
router.get("/:id", async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json("Category not found");
    res.status(200).json(cat);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE a category by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json("Category not found");
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json("Category not found");
    res.status(200).json("Category deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
