export const fetchCollections = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:8080/movies/collections/my-collections",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }

  return response.json();
};