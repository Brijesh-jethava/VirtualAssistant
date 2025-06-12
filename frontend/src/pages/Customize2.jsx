import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom'

const Customize2 = () => {

    const {selectedImage,userData,backendImage, serverUrl,setUserData} = useContext(userDataContext)
    const[assistantName,setAssistantName] = useState(userData?.assistantName || '')
    const[loading,setLoading] = useState(false)
    const navigate = useNavigate();

    const handleUpdateAssistant = async()=>{
         setLoading(true);
        try{
         let formData = new FormData();
         formData.append('assistantName', assistantName); 

         if(backendImage) {
            formData.append('assistantImage', backendImage);
         }
         else{
            formData.append('imageUrl', selectedImage);
         }
         const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
        
         setLoading(false);
         setUserData(result.data);
         navigate('/');

        }catch(error){
          setLoading(false);
          console.log("Error:", error);
        }
    }
    
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-blue-950 flex justify-center items-center flex-col relative'>


        <IoMdArrowBack className='absolute top-[30px] left-[30px] text-white text-3xl cursor-pointer '  onClick={()=>navigate('/customize')}/>
        <img src={selectedImage}  className='w-[70px] h-[140px] lg:w-[200px] lg:h-[300px] bg-[#2a2a42] border-2 border-[#1818e38f] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#6161d2] cursor-pointer hover:border-2 hover:border-white mb-5 object-cover'/>
        <h1 className='text-white text-[30px] text-center pb-6'>Enter your <span className='text-blue-400 text-shadow-2xs'>Assistant Name</span></h1>

         <input type="text" placeholder='eg.Nitya' className='w-[35%] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] mb-6' required name='name' value={assistantName} onChange={(e)=>setAssistantName(e.target.value)} />

        {assistantName && 
         <button type='submit' 
           className='w-[25%] h-[60px] bg-white rounded-full text-black text-[19px] font-semibold cursor-pointer mb-[10px]' 
           onClick={()=>handleUpdateAssistant()}>
            Finally created your own assistant
        </button>}
         
    </div>
  )
}

export default Customize2
