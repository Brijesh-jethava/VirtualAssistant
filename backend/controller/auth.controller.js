import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const sighnup = async(req,res)=>{

  try{
    const {name,email,password} = req.body;

     if(!name || !email || !password){
        return res.status(400).json({message:"Please fill all the fields"});
    }
    
    const userExist = await User.findOne({email});

    if(userExist) {
        return res.status(400).json({message:"User already exists"});
    }

    if(password.length < 6){
        return res.status(400).json({message:"Password must be at least 6 characters long"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password : hashedPassword,
    });

    const token  = await genToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'strict',
        secure:false
    });

     //user.save();

    return res.status(201).json(user)

}catch(error){
    console.log("Error in signup:", error);
  }
}

export const login = async(req,res)=>{

  try{
    const {email,password} = req.body;

     if(!email || !password){
        return res.status(400).json({message:"Please fill all the fields"});
    }
    
    const user = await User.findOne({email});

    if(!user) {
        return res.status(400).json({message:"User not exists"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({message:'Invalid credentials'});
    }

    const token  = await genToken(user._id);
    
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'strict',
        secure:false
    });

     //user.save();

    return res.status(200).json(user)

}catch(error){
    console.log("Error in login:", error);
  }
}

export const logout = async(re,res) =>{
    try{
     res.clearCookie('token')
        return res.status(200).json({message:"Logout successful"});
    }catch(error){
        console.log("Error in logout:", error);
    }
}