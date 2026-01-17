import { Outlet } from "react-router-dom";
import { AuthNavbar } from "./authNavbar.jsx";

export function AuthLayout(){
    return(
       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black 
        via-neutral-900 to-purple-900 px-4">
            <AuthNavbar />
            <Outlet />
        </div>
    )
}