
export const checkEmail = async (email) => {
    const response = await fetch(`http://localhost:8080/auth/check-email?email=${encodeURIComponent(email)}`);

     if(!response.ok){
        throw new Error("Failed to check email");
    }

    return response.json();
}