const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
}

exports.registerUser = async(req,res)=>{
    try {
        const {name,email,password} = req.body;

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        const hashPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashPassword
        })

        res.json({user,token:generateToken(user._id)});
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

exports.loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }

        res.json({user,token:generateToken(user._id)});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}