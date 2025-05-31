import { useParams } from "react-router-dom"
import apiHelper from "../helper/ApiHelper"
import toast, { Toaster } from "react-hot-toast"

const VerifyPage = () => {
    const {email, otp} = useParams()
    const submitData = async () => {
  if (!email || !otp) {
    toast.error("Invalid link");
    return;
  }

  let savedMovie = [];
  try {
    const raw = localStorage.getItem("local-save");
    savedMovie = raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to parse local-save from localStorage");
  }

  const payload = { email, otp, savedMovie };

  try {
    const response = await apiHelper.post("/auth/verify-email", payload);

    if (!response.condition) {
      toast.error(response.message, { duration: 3000 });
      return;
    }

    if (response.token) {
      localStorage.setItem("streamhaven-token", response.token);
    }

    toast.success(response.message, { duration: 3000 });

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  } catch (err) {
    console.error("Verification error:", err);
    toast.error("Something went wrong. Please try again.", { duration: 3000 });
  }
};


    console.log()
  return (
    <div className='background-color'>
        <Toaster />
        <div className='min-h-[100dvh] grid place-items-center m=4'>
            <div className="flex flex-col w-90% mx-10">
                <img src="/image/email-verification.png" className="w-full max-w-[30rem]" alt="" />
                <h1 className='text-[3rem] leading-[3.8rem]'>Verify Your Email</h1>
                <p className='text-sm max-w-[20rem]'>We need to verify your email to make sure you are a human, Click Button Below to Verify Your Email</p>
                <button onClick={submitData} className='cursor-pointer w-full h-[2rem] bg-primary-color-and-hover rounded-[3px] mt-[2rem]' >Verify</button>
            </div>
        </div>
    </div>
  )
}

export default VerifyPage