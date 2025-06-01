import { useNavigate, useParams } from "react-router-dom"
import apiHelper from "../helper/ApiHelper"
import toast, { Toaster } from "react-hot-toast"
import { useState } from "react"

const ResetPassPage = () => {
    const [show, setShow] = useState(false)
    const toggleShow = () => {
        setShow(prevState => !prevState)
    }

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    
    const {email, otp} = useParams()
    const navigate = useNavigate()

    const validate = () => {
    
        if (password !== confirmPassword) {
            toast.error("Password doeset match")
            return false
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.")
            return false
        }

    
        return true
    }

const submitData = async () => {
  if (!validate()) return;

  if (!email || !otp) {
    toast.error("Invalid link");
    return;
  }

  const payload = {
    email,
    otp,
    newPassword: password
  };

  try {
    const response = await apiHelper.post("/auth/verify-reset", payload);

    if (!response.condition) {
      toast.error(response.message, { duration: 3000 });
      return;
    }

    if (response.token) {
      localStorage.setItem("streamhaven-token", response.token);
    }

    toast.success(response.message, { duration: 3000 });

    setTimeout(() => navigate("/"), 2000);
  } catch (error) {
    console.error("Password reset error:", error);
    toast.error("Something went wrong. Please try again.", { duration: 3000 });
  }
};

  return (
    <div className='background-color'>
        <Toaster />
        <div className='min-h-[100dvh] grid place-items-center m=4'>
            <div className="flex flex-col w-90% mx-10">
                <img src="/image/password-reset.png" className="w-full max-w-[15rem] mx-auto" alt="" />
                <h1 className='text-[3rem] leading-[3.8rem]'>Reset Your Password</h1>
                {show ? (
                    <>
                        <div className="mb-[1.5rem]">
                            <p className="text-sm mb-[.5rem]">Password</p>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} className="text-sm focus:outline-none focus:ring-0 w-full h-[2rem] p-2 text-black rounded-[3px]" placeholder="Password" type="text" />
                        </div>
                        <div className="mb-[.5rem]">
                            <p className="text-sm mb-[.5rem]">Confirm Password</p>
                            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="text-sm focus:outline-none focus:ring-0 w-full h-[2rem] p-2 text-black rounded-[3px]" placeholder="Confirm Password" type="text" />
                        </div>
                    </>
                ):(
                    <>
                        <div className="mb-[1.5rem]">
                            <p className="text-sm mb-[.5rem]">Password</p>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} className="text-sm focus:outline-none focus:ring-0 w-full h-[2rem] p-2 text-black rounded-[3px]" placeholder="Password" type="password" />
                        </div>
                        <div className="mb-[.5rem]">
                            <p className="text-sm mb-[.5rem]">Confirm Password</p>
                            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="text-sm focus:outline-none focus:ring-0 w-full h-[2rem] p-2 text-black rounded-[3px]" placeholder="Confirm Password" type="password" />
                        </div>
                    </>
                )}


                {show ? (
                    <div className="flex text-sm items-center gap-1 mb-[1rem]">
                        <svg onClick={toggleShow} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        <p>Hide Password</p>
                    </div>
                
                ) : (
                    <div className="flex text-sm items-center gap-1 mb-[1rem]">
                        <svg onClick={toggleShow} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <p>Show Password</p>
                    </div>
                )}
                <button onClick={submitData} className='cursor-pointer w-full h-[2rem] bg-primary-color-and-hover rounded-[3px] mt-[2rem]' >Reset</button>
            </div>
        </div>
    </div>
  )
}

export default ResetPassPage