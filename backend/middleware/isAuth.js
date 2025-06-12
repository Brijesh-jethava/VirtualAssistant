import jwt from 'jsonwebtoken';

const isAuth = async (req,res,next) => {
  try{
     const token = req.cookies.token;

    if(!token){
      return res.status(401).json({message:"Unauthorized access"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    if(!decoded){
      return res.status(401).json({message:"Invalid token"});
    }

    req.id = decoded.userId; // Attach userId to request object
   
    next(); // Proceed to the next middleware or route handler
  }catch(error){
    console.log("Error in isAuth middleware:", error)
    return res.status(500).json({message:"isAuth error"});
  }
}

export default isAuth;
