const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.adminLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Admin not found" });
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ admin:user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async(req,res)=>{
    const search = req.query.search||"";

    const users = await User.find({
        isAdmin:false,
        name:{$regex:search,$options:'i'}
    })

    res.json(users);
}

exports.createUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async(req,res)=>{
    const { email } = req.body;

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.params.id }, 
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(user);
}
exports.deleteUser = async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);

    res.json({message:"User deleted"});
}