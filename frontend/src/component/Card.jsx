import React from 'react'
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';

const Card = ({image}) => {
  const {serverUrl,userData,setUserData,frontendImage, setFrontendImage,backendImage, setBackendImage,selectedImage, setSelectedImage } = useContext(userDataContext);
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#2a2a42] border-2 border-[#1818e38f] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#6161d2] cursor-pointer hover:border-2 hover:border-white 
        ${selectedImage == image ? "border-2 border-white shadow-2xl shadow-[#6161d2]": null}`} 
        onClick={()=> {setSelectedImage(image), setBackendImage(null), setFrontendImage(null)}}>

       <img src={image}  className='h-full object-cover rounded-2xl'/>
    </div>
  )
}

export default Card
