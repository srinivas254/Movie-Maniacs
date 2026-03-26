
export const checkUsername = async (userName) => {
    const response = await fetch(`http://localhost:8080/auth/check-username?userName=${encodeURIComponent(userName)}`);

    if(!response.ok){
        throw new Error("Failed to check username");
    }

    return response.json();
}