const express = require("express");
const User = require("../models/User");
const router = express.Router();
const {body,validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = "rajat123@";

router.post("/CreateUser",
[body("name").isLength({min: 3}),
body("email","enter a valid email").isEmail(),
body("password","password must be atleast 7 characters").isLength({min : 7})], async (req,res)=>{
    // If there are errors return bad request
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        success = true;
        return res.status(400).json({success:success,errors: errors.array()});
    }
    // Check whether the user with this email exists already
    try{
        let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:"Sorry a user with this email already exists"})
    }
        const salt = await bcrypt.genSalt(10);  
         const securePass = await bcrypt.hash(req.body.password,salt)

        user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : securePass
    })
    const data = {
        user:{
            id : user.id
        }
    }
    success = true;
    const authToken = jwt.sign(data,JWT_SECRET);
    res.json({success,authToken});

    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal Server Error");
        
    } 
})

//Authenticate a user using  : POST "/api/auth/login"

router.post("/login", [body("email","Enter a valid email").isEmail(), body("password","Password must be atleast 7 characters").isLength()] ,  async (req,res) =>{
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            res.status(400).json({error: "Please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error :"Please try to login with correct credentials"});
        }

        const data = {
            user : {
                id : user.id
            }
        }
        success = true; 
        const authToken = jwt.sign(data,JWT_SECRET);
        res.json({success,authToken}); 
    }
    catch(error){
        res.status(500).send("Internal Server Error");
    }

})

// Get loggedin user details using POST "/api/auth/getUser".

    router.post("/getUser",fetchUser, async (req,res)=>{
        try {
           let  userid = req.user.id;
           const user = await User.findById(userid).select("-password"); 
           res.send(user);
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    })
  
module.exports = router