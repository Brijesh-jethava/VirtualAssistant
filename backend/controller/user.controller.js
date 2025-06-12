import moment from "moment/moment.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req,res) =>{
    try{
      const userId = req.id;
      const user = await User.findById(userId).select("-password")

      if(!user){
        return res.status(400).json({message: "User not found"})
      }

      return res.status(200).json(user)

    }catch(error){
      return res.status(400).json({message:"get current user error"})
    }
}

export const updateAssistant = async(req,res)=>{
  try{
    const{assistantName, imageUrl} = req.body;
    let assistantImage;

    if(req.file){
      assistantImage = await uploadOnCloudinary(req.file.path);
    }else{
      assistantImage = imageUrl;
    }


    const user = await User.findByIdAndUpdate(req.id,{assistantName,assistantImage},{new:true}).select("-password")
    res.status(200).json(user);

  }catch(error){
    console.log("Error in updateAssistant:", error);  
    return res.status(400).json({message:"update assistant error"})
  }
}

export const askToAssistant = async(req,res)=>{
  try{
    const {command} = req.body;
    const userId = req.id;
    const user = await User.findById(userId);
    user.history.push(command)
    user.save();

    const userName = user.name;
    const assistantName = user.assistantName ;

    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);

    if(!jsonMatch){
      return res.status(400).json({response:"Invalid response from AI assistant"});
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    switch(type){
      case 'get-date':
          return res.status(200).json({type, userInput:gemResult.userInput,  response: `Today's date is ${moment().format('Do MMMM YYYY')}`});
      case 'get-time':
          return res.status(200).json({type, userInput:gemResult.userInput,  response: `current time is ${moment().format('hh:mm A')}`});
      case 'get-day':
          return res.status(200).json({type, userInput:gemResult.userInput,  response: `Today is ${moment().format('dddd')}`});
      case 'get-month':
          return res.status(200).json({type, userInput:gemResult.userInput,  response: `current month is ${moment().format('MMMM')}`});
      case 'google-search':          
      case 'youtube-search': 
      case 'youtube-play': 
      case 'general': 
      case 'calculator-open': 
      case 'facebook-open': 
      case 'instagram-open':
      case 'twitter-open': 
      case 'weather-show': 
          return res.status(200).json({type, userInput:gemResult.userInput,  response: gemResult.response});             
          
      default:
          return res.status(400).json({response:"sorry,i don't understand your command"});
    }

    

  }catch(error){

  }
}