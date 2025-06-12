import react from 'react'
import bg from '../assets/authBg.png'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

    const initialState = {
        email:'',
        password: '',
     }

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData,setFormData] = useState(initialState);
    const [loading,setLoading] = useState(false);
    const [err,setErr] = useState('')

    const navigate = useNavigate();

    const {serverUrl,userData,setUserData} = useContext(userDataContext);

    const handleChange = (e) =>{
            const {name, value} = e.target;
            setFormData({
                ...formData,
                [name]: value
            });
        }
    
    const onSubmit = async(e)=>{
            e.preventDefault();
            console.log(formData);
            
            setErr("")
            setLoading(true);
            try{
              let result = await axios.post(`${serverUrl}/api/auth/signin`,formData, {withCredentials: true})
              setUserData(result.data);
              setLoading(false);
              navigate('/');
            }catch(error)
            {
                console.log("Error in signin:", error);
                setUserData(null)
                setLoading(false);
                setErr(error.response.data.message)
            }
        }
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
       <form onSubmit={onSubmit} className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col justify-center items-center gap-[20px] px-[20px]'>

           <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Welcome to <span className='text-blue-400'>Virtual Assistant</span></h1>

           
           <input type="email" placeholder='johndoe@gmail.com' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required name='email' value={formData.email} onChange={handleChange}/>

           <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
              <input type ={showPassword ? 'text' : 'password'} placeholder='password' className='w-full h-[60px] outline-none  bg-transparent placeholder-gray-300 px-[20px] py-[10px] ' required name='password' value={formData.password} onChange={handleChange}/>

              {!showPassword ? 
              <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] cursor-pointer'onClick={()=>setShowPassword(true)}/>
              : 
                <IoEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] cursor-pointer'onClick={()=>setShowPassword(false)} />
              }
           </div>

           <button type='submit' className='w-full h-[60px] bg-white rounded-full text-black text-[19px] font-semibold cursor-pointer mb-[10px]' disabled={loading}>
            {loading? "Loading...": "Sign In"}
           </button>

           {err.length>0 && <p className='text-red-600 text-[17px] text-left'>
              *{err}
            </p> 
            }

           <p className='text-white text-[18px] cursor-pointer hover:underline' onClick={()=>navigate('/signup')}>Don't have an account? <span className=' text-blue-400 '>Sign Up</span></p>
  
       </form>
    </div>
  )
}

export default SignIn;
