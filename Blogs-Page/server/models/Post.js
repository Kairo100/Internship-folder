const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  description:    { type: String, required: true },
  image: { type: String, default: "" },
  author :{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
  category:{type:mongoose.Schema.Types.ObjectId, ref :"Category", required:true},
  date: { type: Date, default: Date.now } 
}, { timestamps: true });


module.exports = mongoose.model("Post", postSchema);