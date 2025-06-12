import React from 'react'
import img1 from '../assets/image1.png'
import img2 from '../assets/image2.jpg'
import img3 from '../assets/image4.png'
import img4 from '../assets/image5.png'
import img5 from '../assets/image6.jpeg'
import img6 from '../assets/image7.jpeg'
import img7 from '../assets/authBg.png'
import Card from '../component/Card.jsx'
import { RiImageAddLine } from "react-icons/ri";
import { useState } from 'react'
import { useRef } from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowBack } from "react-icons/io";

const Customize = () => {

    const {serverUrl,userData,setUserData,frontendImage, setFrontendImage,backendImage, setBackendImage,selectedImage, setSelectedImage } = useContext(userDataContext);
    const inputImage =useRef();
    const navigate = useNavigate();

    const handleImage = (e)=>{
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    }

    return(
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-blue-950 flex justify-center items-center flex-col relative'>

       <IoMdArrowBack className='absolute top-[30px] left-[30px] text-white text-3xl cursor-pointer '  onClick={()=>navigate('/')}/>
        <h1 className='text-white text-[30px] text-center pb-6'>Select your <span className='text-blue-400 text-shadow-2xs'>Assistant Image</span></h1>    
        <div className='w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]'>
            <Card image={img1}/>
            <Card image={img2}/>
            <Card image={img3}/>
            <Card image={img4}/>
            <Card image={img5}/>
            <Card image={img6}/>
            <Card image={img7}/>

    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#2a2a42] border-2 border-[#0000ff17] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#6161d2] cursor-pointer hover:border-2 hover:border-white flex justify-center items-center ${selectedImage == 'input' ? "border-2 border-white shadow-2xl shadow-[#6161d2]": null}`} onClick={()=>{inputImage.current.click(), setSelectedImage('input')}}>
       {!frontendImage ?  <RiImageAddLine className='text-white w-[30px] h-[30px] '/> : <img src={frontendImage} className='h-full object-cover' />}
    </div>
          <input type="file"accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
  </div>       
    {selectedImage ? <button className='w-[120px] h-[50px] bg-white rounded-full text-black text-[19px] font-semibold cursor-pointer mb-[10px] mt-4 ' onClick={()=>navigate('/customize2')}>Next</button>  : null}
    
</div>
  )
}

export default Customize
