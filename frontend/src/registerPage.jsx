import { Logo } from "./siteLogo.jsx";
import { useState ,useEffect} from "react";
import { PasswordField } from "./password.jsx";
import { UserNameField } from "./userName.jsx";
import { getPasswordStrength } from "./passwordStrength";
import { getPasswordIssues } from "./passwordIssues";
import { getUsernameIssues } from "./userNameIssues.js";
import { useNavigate,useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { checkUsername } from "./checkUsername.js";
import { checkEmail } from "./checkEmail.js";
import { GoogleOAuthButton } from "./googleoAuth.jsx";

export function Register() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-black via-neutral-800 to-yellow-400 px-4"
    >
      <h1 className="pt-6">
        <Logo className="text-2xl mb-10 cursor-default" />
      </h1>

      <RegisterCard />

      <p className="text-white text-sm mt-4 mb-8">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="font-semibold cursor-pointer hover:underline decoration-white"
        >
          Log in
        </span>
      </p>
    </div>
  );
}

function RegisterCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameCheckError, setUsernameCheckError] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailCheckError, setEmailCheckError] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setRegisterError(error);
    }
  }, [searchParams]);

  const passwordStrength = getPasswordStrength(password);
  const passIssues = getPasswordIssues(password);
  const userNameIssues = getUsernameIssues(userName);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const userNameRegex = /^[a-z][^@\s]*$/;

  const isUserNameValid =
    userName.trim() !== "" &&
    userName.length >= 10 &&
    userNameRegex.test(userName);

  const isEmailValid = email.trim() !== "" && emailRegex.test(email);

  const isFormValid =
    name.trim() !== "" &&
    isEmailValid &&
    isUserNameValid &&
    isUsernameAvailable === true &&
    usernameCheckError === false &&
    isCheckingUsername === false &&
    isEmailAvailable === true &&
    emailCheckError === false &&
    isCheckingEmail === false &&
    passwordStrength.isValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          userName,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log("REGISTER ERROR", err.message);
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleUsernameBlur = async () => {
    if (!isUserNameValid) return;

    if (isUsernameAvailable !== null) return;

    try {
      setIsCheckingUsername(true);

      const data = await checkUsername(userName);

      if (data.available) {
        setIsUsernameAvailable(true);
      } else {
        setIsUsernameAvailable(false);
      }
    } catch (err) {
      console.error("Username check failed:", err);
      setUsernameCheckError(true);
      setIsUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleEmailBlur = async () => {
    if (!isEmailValid) return;

    if (isEmailAvailable !== null) return;

    try {
      setIsCheckingEmail(true);

      const data = await checkEmail(email);

      if (data.available) {
        setIsEmailAvailable(true);
      } else {
        setIsEmailAvailable(false);
      }
    } catch (err) {
      console.error("Email check failed:", err);
      setEmailCheckError(true);
      setIsEmailAvailable(null);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Register
      </h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <h4 className="text-sm cursor-default">Name</h4>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
        />

        <h4 className="text-sm cursor-default">Email</h4>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsEmailAvailable(null);
            setEmailCheckError(false);
          }}
          onBlur={handleEmailBlur}
          className="w-full border border-gray-300 rounded-lg px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
        />

        {isCheckingEmail && (
          <p className="text-sm text-gray-500 mt-1">Checking email…</p>
        )}

        {isEmailAvailable === true && (
          <p className="text-sm text-green-600 mt-1">✅ Email available</p>
        )}

        {isEmailAvailable === false && (
          <p className="text-sm text-red-600 mt-1">❌ Email already taken</p>
        )}

        {emailCheckError && (
          <p className="text-sm text-orange-600 mt-1">
            ⚠️ Unable to check email right now. Try again.
          </p>
        )}

        <h4 className="text-sm cursor-default">Username</h4>
        <UserNameField
          value={userName}
          onChange={(value) => {
            setUsername(value);
            setIsUsernameAvailable(null);
            setUsernameCheckError(false);
          }}
          onBlur={handleUsernameBlur}
          issues={userNameIssues}
        />

        {isCheckingUsername && (
          <p className="text-sm text-gray-500 mt-1">Checking username…</p>
        )}

        {isUsernameAvailable === true && (
          <p className="text-sm text-green-600 mt-1">✅ Username available</p>
        )}

        {isUsernameAvailable === false && (
          <p className="text-sm text-red-600 mt-1">❌ Username already taken</p>
        )}

        {usernameCheckError && (
          <p className="text-sm text-orange-600 mt-1">
            ⚠️ Unable to check username right now. Try again.
          </p>
        )}

        <h4 className="text-sm cursor-default">Password</h4>
        <PasswordField
          value={password}
          onChange={setPassword}
          passwordStrength={passwordStrength}
          issues={passIssues}
        />

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-white
          font-medium py-2 rounded-3xl transition disabled:bg-gray-400 disabled:text-gray-700
          disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        >
          Register
        </button>
      </form>

      <div className="my-4 text-center text-gray-400 text-sm">OR</div>

      <GoogleOAuthButton text="Register with Google" mode="register" />

      {registerError && (
        <p className="text-sm text-red-600 text-center mt-2">
          {registerError}
        </p>
      )}
    </div>
  );
}
