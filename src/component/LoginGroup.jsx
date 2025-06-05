import { useState } from "react";
import toast from "react-hot-toast";
import apiHelper from "../helper/ApiHelper";

const LoginGroup = () => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(prev => !prev);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const makeError = (message) => {
    setIsError(true);
    setErrorMessage(message);
  };

  const validate = () => {
    if (!email || !password) {
      makeError("All fields must be filled.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      makeError("Invalid email format.");
      return false;
    }

    if (password.length < 8) {
      makeError("Password must be at least 8 characters long.");
      return false;
    }

    return true;
  };

  const submitData = () => {
    if (!validate()) return;

    const payload = { email, password };

    toast.promise(
      apiHelper.post("/auth/login", payload),
      {
        loading: "Logging in...",
        success: (response) => {
          if (!response.condition) {
            toast.error(response.message, { duration: 1000 });
            throw new Error("Login failed");
          }

          localStorage.setItem("streamhaven-token", response.token);
          setTimeout(() => window.location.reload(), 1500);
          return response.message;
        },
        error: "Login failed. Please try again."
      }
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <h1 className="text-center text-2xl mb-4">
        <span className="color-primary">Enter</span> Your Account
      </h1>

      {isError && (
        <div className="w-full bg-red-200 p-2 mb-2 border border-red-500 rounded-[3px]">
          <span className="text-red-500 text-sm">{errorMessage}</span>
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="login-email" className="text-sm block mb-1">Email Address</label>
        <input
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@gmail.com"
          type="text"
          className="text-sm w-full h-[2rem] p-2 text-black rounded-[3px] focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && document.getElementById("login-password")?.focus()}
        />
      </div>

      {/* Password */}
      <div className="mb-2">
        <label htmlFor="login-password" className="text-sm block mb-1">Password</label>
        <input
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type={show ? "text" : "password"}
          className="text-sm w-full h-[2rem] p-2 text-black rounded-[3px] focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && submitData()}
        />
      </div>

      {/* Toggle password visibility */}
      <div className="flex text-sm items-center gap-2 mb-4 cursor-pointer" onClick={toggleShow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          {show ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
          ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </>          )}
        </svg>
        <span>{show ? "Hide Password" : "Show Password"}</span>
      </div>

      {/* Submit Button */}
      <button
      onClick={submitData}
        type="submit"
        className="rounded-[5px] w-full bg-primary-color-and-hover cursor-pointer h-[2.5rem] mb-1 text-white"
      >
        Submit
      </button>
      
        <div className="flex items-center my-2">
  <div className="flex-grow border-t border-gray-300" />
  <span className="px-4 text-gray-300 text-sm">or</span>
  <div className="flex-grow border-t border-gray-300" />
</div>

<button
  onClick={() => window.location.href = 'https://streamhaven-be.onrender.com/auth/google'}
  className="px-4 hover:bg-gray-300 cursor-pointer mb-2 py-2 flex gap-2 items-center justify-center bg-white text-black rounded-md w-full"
>
  <img
    className="w-6 h-6"
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    loading="lazy"
    alt="google logo"
  />
  <span>Login with Google</span>
</button>


    </form>
  );
};

export default LoginGroup;
