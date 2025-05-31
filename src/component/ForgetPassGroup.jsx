import { useState } from "react"
import toast from "react-hot-toast"
import apiHelper from "../helper/ApiHelper"


const ForgetPassGroup = () => {
    const [email, setEmail] = useState("")

    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const makeError = (message) => {
        setIsError(true)
        setErrorMessage(message)
    }

    const validate = () => {
    
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            makeError("Invalid email format.")
            return false
        }
    
        return true
    }

const submitData = async () => {
  if (!validate()) return;
  console.log("data submitted");

  const payload = {
    email: email
  };

  toast.promise(
    apiHelper.post("/auth/resetpass", payload),
    {
      loading: "Sending password reset...",
      success: (response) => {
        if (!response.condition) {
          toast.error(response.message, { duration: 3000 });
          throw new Error("Reset failed");
        }
        return response.message; // shown as toast.success
      },
      error: "Failed to send reset email. Try again."
    }
  );
};

  return (
    <div>
        <h1 className="text-center text-2xl mb-[1rem]">Did You <span className="color-primary">Forget</span> Your <br />Password</h1>
        {/* <Toaster /> */}

        {isError && (
            <div className="w-full bg-red-200 p-2 mb-2 border-1 border-red-500 rounded-[3px]">
                <span className="text-red-500 text-[.8rem]">{errorMessage}</span>
            </div>
        )}
        <div className="mb-[1.5rem]">
            <p className="text-sm mb-[.5rem]">Email Address</p>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} className="text-sm focus:outline-none focus:ring-0 w-full h-[2rem] p-2 text-black rounded-[3px]" placeholder="email@gmail.com" type="text" />
        </div>

        <button onClick={submitData} className="rounded-[5px] w-full bg-primary-color-and-hover cursor-pointer h-[2.5rem] mb-[1rem]">Submit</button>

    </div>
    )
}

export default ForgetPassGroup