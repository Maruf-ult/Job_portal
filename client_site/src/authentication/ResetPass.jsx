import { useState, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoading,hideLoading } from "../Redux/AlertSlice";

function ResetPass() {
  axios.defaults.withCredentials = true; 
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const url = import.meta.env.VITE_BACKEND_URL

  const inputRefs = useRef([]);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading()); 
      const { data } = await axios.post(`${url}/api/send-reset-otp`, { email });
      console.log(data)
      data.success ? toast.success(data.msg) : toast.error(data.msg);
      data.success && setIsEmailSent(true);
    } catch (error) {
      console.error("API error:", error);
      toast.error(error.response?.data?.msg || "An unexpected error occurred.");

    } finally {
      dispatch(hideLoading()); 
    }
  };

  const onSubmitOtp = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input?.value || "");
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading()); 
      const { data } = await axios.post(`${url}/api/reset-password`, {
        email,
        otp,
        newPassword,
      });
      data.success ? toast.success(data.msg) : toast.error(data.msg);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.msg);
    } finally {
      dispatch(hideLoading()); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

  {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="bg-white p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-black text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
          <p className="text-center mb-6 text-gray-600">Enter your registered email address</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-200">
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-[#6A38C2] text-white rounded-full mt-3 cursor-pointer">
            Submit
          </button>
        </form>
      )}

      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOtp} className="bg-white p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-black text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
          <p className="text-center mb-6 text-gray-600">Enter the 6-digit code sent to your email.</p>
          <div className="flex justify-between mb-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  className="w-12 h-12 bg-gray-200 text-black text-center text-xl rounded-md border border-gray-300"
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-[#6A38C2] text-white rounded-full cursor-pointer"
          >
            Submit
          </button>
        </form>
      )}

      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-white p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-black text-2xl font-semibold text-center mb-4">New Password</h1>
          <p className="text-center mb-6 text-gray-600">Enter the new password below</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-200">
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-[#6A38C2] text-white rounded-full mt-3 cursor-pointer">
            Submit
          </button>
        </form>
      )}

    </div>
  );
}

export default ResetPass;