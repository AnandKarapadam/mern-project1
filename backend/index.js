require("dotenv").config();
const connectDB = require("./config/db");
const express = require('express');
const cors = require('cors');


const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes'); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth',authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api',profileRoutes);

app.get('/',(req,res)=>{
    res.send('API Running');
})

const PORT = process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`);
})