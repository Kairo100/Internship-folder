const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async(req, res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await User({
           username: req.body.username,
      email:    req.body.email,
      password: hashedPassword
        })

        const savedUser = await newUser.save();
    
        const {password , ...others} = savedUser._doc;
        res.status(201).json(others)
    }
    catch (err){
        res.status(500).json(err)
    }
});


router.post("/login" , async (req, res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user) return res.status(401).json("User is not found");

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(401).json("Wrong Password");

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"})

        const {password, ...others} = user._doc;
        res.status(200).json({ ...others, token });

    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router