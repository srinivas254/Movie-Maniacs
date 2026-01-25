import { useState, useEffect } from "react";
import { Logo } from "./siteLogo.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
  const storedId = sessionStorage.getItem("userId");
  if (!storedId) {
    navigate("/login");
  }
}, [navigate]);


  useEffect(() => {
    if(otpVerified) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        sessionStorage.removeItem("userId");
        navigate("/login");
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [navigate,otpVerified]);

const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const isFormValid = otp.join("").length === 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      setIsVerifying(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/auth/jwt/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: otp.join("")
          }),
        },
      );

      if (!response.ok) {

        if (response.status === 404) {
          throw new Error("OTP not found");
        }

        if (response.status === 400) {
          throw new Error("Invalid OTP");
        }

        if (response.status === 417) {
          throw new Error("OTP expired");
        }

        throw new Error("Server error. Try again");
      }

      const data = await response.json();

      setOtpVerified(true);

      sessionStorage.removeItem("userId");
      toast.success("Login successfull");
      localStorage.setItem("token", data.token);

      setTimeout(() => {
        navigate("/explore");
      }, 1500);
    } catch (err) {
      console.error("OTP verification failed:", err);
      toast.error(err.message || "Something went wrong");
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-br from-black via-neutral-800 to-purple-500 px-4"
    >
      <h1>
        <Logo className="text-2xl mb-10 cursor-default" />
      </h1>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-500 text-center mb-2">
          Enter the 6-digit OTP sent to your registered email
        </p>

        {/* ⏱️ Timer display */}
        <p className="text-sm text-center text-purple-600 mb-6">
          OTP expires in {minutes}:{seconds.toString().padStart(2, "0")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) =>
                  handleOtpChange(e.target.value, index)
                }
                className="w-12 h-12 text-center text-xl font-semibold
                border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isVerifying}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white
            font-medium py-2 rounded-3xl transition
            disabled:bg-gray-400 disabled:text-gray-700
            disabled:cursor-not-allowed disabled:hover:bg-gray-400"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
