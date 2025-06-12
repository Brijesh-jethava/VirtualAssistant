import React, { useContext, useEffect } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TypingParagraph from './TypingParagrph'
import { useState } from 'react'
import { useRef } from 'react'
import ai from '../assets/ai.gif'
import user from '../assets/user.gif'
import { CgMenuRight } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";

const Home = () => {
  const {userData,serverUrl,setUserData,getGeminiResponse} = useContext(userDataContext)
  const navigate   = useNavigate();
  const[listening,setListening] = useState(false)
  const[userText,setUserText] = useState('')
  const[aiText,setAiText]= useState("")
  const[ham,setHam] = useState(false)
  
  const isSpeakingRef = useRef(false)
  const isRecognitionRef = useRef(false)
  const recognitionRef = useRef(null)
  const synth =  window.speechSynthesis; //Global variable

  const handleLogout = async ()=>{
     try{
       const result = await axios(`${serverUrl}/api/auth/logout`, {withCredentials: true});
       setUserData(null);
       navigate('/signin');
     }catch(error){
      console.log("Error in handleLogout:", error);
      setUserData(null);
     }
  }

  const startRecognition = ()=>{

    if(!isSpeakingRef.current && !isRecognitionRef.current){ 
    try{
     recognitionRef.current?.start()
     console.log('Recognition requested starr')
    }catch(error){
      if(error.name !== 'InvalidStateError'){
        console.error("Start error",error)
       }
    }
   }
  }

  const speak = (text) =>{
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v=>v.lang === 'hi-IN');

    if(hindiVoice){
      utterence.voice = hindiVoice;
    }

    isSpeakingRef.current = true
    utterence.onend = ()=>{
      setAiText('')
      isSpeakingRef.current = false

      setTimeout(()=>{
         startRecognition()
      },800)
      
    }
    synth.cancel();
    synth.speak(utterence)
  }

  const handleCommand = (data) =>{

   const {type, userInput, response} = data;
   speak(response)  ;

 if(type === 'google-search'){
    const query = encodeURIComponent(userInput);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
 }

   if(type === 'calculator-open'){
     window.open(`https://www.google.com/search?q=calculator`, '_blank'); 
 }

    if(type ==='facebook-open'){
    window.open('https://www.facebook.com', '_blank');
 }

    if(type === 'instagram-open'){
     window.open('https://www.instagram.com', '_blank');
 }

    if(type === 'twitter-open'){
      window.open('https://www.twitter.com', '_blank');
    }

      if(type === 'weather-show'){
     const query = encodeURIComponent(userInput || 'weather');
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if(type === 'youtube-search' || type === 'youtube-play'){
     const query = encodeURIComponent(userInput);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
 }

}

  

  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition;
   
    let isMounted = true;

    const startTimeout = setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognitionRef.current){
        try{
          recognition.start();
          console.log('Recognition requested to start')
        }catch(e){
          if(e.name !== 'InvalidStateError'){
            console.error(e);
          }
        }
      }
    },1000);

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognitionRef.current = true;
      setListening(true);
    }

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognitionRef.current = false;
      setListening(false);

    if(isMounted && !isRecognitionRef.current)
     {
      setTimeout(()=>{
        if(isMounted){
          try{
            recognition.start();
            console.log("Recognition requested to start");
          }catch(e){
            if(e.name !== 'InvalidStateError')
              {
              console.error(e);
              }
           }
        }
      }, 1000)
    }


   }

   recognition.onerror = (event) =>{
    console.warn("Recognition error:",event.error)
    isRecognitionRef.current = false;
    setListening(false);
    if(event.error !== 'aborted' && isMounted && !isSpeakingRef.current)
    {
      setTimeout(()=>{
         if(isMounted){
           try{ 
               recognition.start();
               console.log("Recognition requested to start");
           }catch(e){
            if(e.name !== 'InvalidStateError')
              console.error(e);
            }
         }
      },1000)
    }
   }


    recognition.onresult = async(e) =>{
      console.log("Speech Recognition Result:", e);
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Transcript:", transcript);

      if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase()))
      {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognitionRef.current = false;
        setListening(false);
        const data =  await getGeminiResponse(transcript);
        console.log("Gemini Response:", data);
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }

    }

    const formatName = userData.name.replace(/[^a-zA-Z ]/g, " ");
    const greeting = new SpeechSynthesisUtterance(`Hello ${formatName} what can i help you with?`);
    greeting.lang = 'hi-IN'
    window.speechSynthesis.speak(greeting)
    
    return()=>{
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop()
      setListening(false);
      isRecognitionRef.current = false;
    }
 },[])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-blue-950 flex justify-center items-center flex-col gap-[10px] relative'>

      <CgMenuRight className='absolute lg:hidden top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer text-white font-semibold ' onClick={()=>setHam(true)}/>

      <div className={`lg:hidden absolute top-0 right-0 w-full h-full bg-[#00000000] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start transition-transform duration-300 ease-in-out ${ham ? 'translate-x-0' : 'translate-x-full'}` }>
          <RxCross1  className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={()=>setHam(false)}/>
           <button className='w-[150px] h-[60px]  bg-white rounded-full text-black text-[16px]  font-semibold cursor-pointer' onClick={handleLogout}>Logout</button>
           <button className='w-[150px] h-[60px] bg-white rounded-full text-black text-[16px]  font-semibold cursor-pointer px-[10px] py-[10px]' onClick={()=>navigate('/customize')}>Customize your Assistant</button>

           <div className='w-full h-[2px] bg-gray-400'></div>
           <h1 className='text-white text-[19px] font-semibold mx-[20px]'>Hostory</h1>

           <div className='w-full h-[400px] overflow-auto flex flex-col'>
             {userData?.history.map((his,index)=>(
              <span key={index} className='text-gray-300 text-[18px] p-[20px] truncate'>{his}</span> 
             ))}
           </div>
      </div>

      <button className='hidden lg:block w-[90px] h-[50px]  bg-white rounded-full text-black text-[19px]  font-semibold cursor-pointer mb-[10px] mt-4 absolute top-[20px] right-[20px]' onClick={handleLogout}>Logout</button>
      <button className='hidden lg:block w-[250px] h-[50px] bg-white rounded-full text-black text-[19px]  font-semibold cursor-pointer mb-[10px] p-[10px] absolute top-[100px] right-[20px]' onClick={()=>navigate('/customize')}>Customize your Assistant</button>

         <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden '>
            <img src={userData?.assistantImage} className='h-full object-cover rounded-4xl shadow-lg shadow-blue-600'/>
         </div>
          
          <TypingParagraph text={userData?.assistantName} />
         {/* <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1> */}
           
           {!aiText ? <img src={user} alt="" className='w-[200px]' /> :<img src={ai} alt="" className='w-[200px]'/>}
           
          <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText? userText : aiText? aiText: null}</h1>
    </div>
  )
}

export default Home
