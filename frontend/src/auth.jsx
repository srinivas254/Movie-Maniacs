import { AuthNavbar } from "./authNavbar.jsx";

export function AuthPage(){
    return(
        <div
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black 
        via-neutral-900 to-purple-900 px-4">
            <AuthNavbar />
        </div>
    )
}