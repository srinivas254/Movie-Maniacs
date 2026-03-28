import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function MovieDetailsPage() {
  const { slug } = useParams(); 

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const getMovie = async () => {
      try {
        console.log(slug);
        const res = await fetch(
          `http://localhost:8080/movies/${slug}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      }
    };

    getMovie();
  }, [slug]);

  if (!movie) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">{movie.name}</h1>
      <p className="text-xl text-gray-400">{movie.year}</p>
    </div>
  );
}