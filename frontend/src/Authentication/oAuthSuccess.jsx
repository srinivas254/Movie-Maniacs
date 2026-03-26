import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function OAuthSuccess() {

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      toast.success("Login successfull!");
      navigate("/explore");
    } 

  }, [navigate]);

  return <h3>Logging you in...</h3>;
}

export default OAuthSuccess;
