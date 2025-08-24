const router = require("express").Router();
const User = require("../models/User");

router.get("/", async (req, res)=>{
    try{
        const users =await  User.find();
    res.status(200).json(users)
    }
     catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({error: "User not found"})
     res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})


router.put("/:id", async(req, res)=>{
 try{
    const updatedUser = await User.findByIdAndUpdate(req.params.id, 
         { $set: req.body }, // updates fields
      { new: true } // return updated doc
    )
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

router.delete("/:id" ,async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User has been deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports= router