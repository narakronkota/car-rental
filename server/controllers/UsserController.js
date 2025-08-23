import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import Car from "../models/Car.js"
import Booking from "../models/Booking.js"
//// lสร้าง token jwt
const generationToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload,process.env.JWT_SECRET)
}

export const registerUser = async (req, res )=>{
    try {
        const {name , email, password} = req.body

        if(!name || !email || !password || password.length< 8){
            return res.json({success: false, message: 'fill all the fields'})
        }

        const userExitsts = await User.findOne({email})
        if(userExitsts){
            return res.json({success :false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name,email,password:hashedPassword})
        const token = generationToken(user._id.toString())
        res.json({success : true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//login user
export const loginUser = async (req,res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success : false, message: "Invlid Credentials"})
        }
         const token = generationToken(user._id.toString())
        res.json({success : true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

///get user data usting token jwt
export const getUserData = async (req, res)=>{
    try {
        const {user} = req;  // ต้องมี req.user
        res.json({success :true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//get alll cars for the fornt end
export const getCars = async (req,res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message:error.message})
    }
}

export const updateOldCarNames = async (req, res) => {
  try {
    // ข้อมูลใหม่จาก client (สมมติส่ง name มาใน body)
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ success: false, message: "New name is required" });
    }

    // อัปเดตรถทั้งหมดที่ image มี endpoint เก่า
   

    res.json({
      success: true,
      message: `${result.modifiedCount} car(s) updated with new name.`,
    });
  } catch (error) {
    console.error("Error updating cars:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ฟังก์ชันอัปเดต status
export const deletePendingBookings = async (req, res) => {
  try {
    // ลบ booking ที่มี status เป็น pending
    const result = await Booking.deleteMany({ status: "confirmed" });

    res.json({
      success: true,
      message: `${result.deletedCount} confirmed booking(s) deleted.`
    });
  } catch (error) {
    console.error("Error  confirmed bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};