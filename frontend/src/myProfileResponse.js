
export async function getMyProfile() {

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8080/users/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }
 
  return res.json();
}