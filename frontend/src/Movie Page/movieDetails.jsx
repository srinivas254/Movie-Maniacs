import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { VibeChart } from "./vibechart";
import { WatchOnline } from "./watchOnline";
import { useMovieStore } from "../Zustand Store/useMovieStore";
import { CastCrew } from "./castCrew";
import { UserOpinionDisplayCard } from "./userOpinionDisplay";
import { UserOpinionInputCard } from "./userOpinionInput";

export function MovieDetailsPage() {
  const { slug } = useParams();

  const movies = useMovieStore((state) => state.movies);
  const addMovie = useMovieStore((state) => state.addMovie);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [userOpinion, setUserOpinion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getMovie = async () => {
    try {
      const res = await fetch(`http://localhost:8080/movies/${slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch movie");
      }

      const data = await res.json();
      setMovieDetails(data);
      addMovie(data);
    } catch (err) {
      console.error(err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!slug) return;

    const cachedMovie = movies.find((m) => m.slugUrl === slug);

    if (cachedMovie) {
      setMovieDetails(cachedMovie);
      return;
    }

    getMovie();
  }, [slug]);

  const handleInterested = async () => {
    try {
      const method = isInterested ? "DELETE" : "POST";

      const res = await fetch(
        `http://localhost:8080/movies/${movieDetails.id}/interested`,
        {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update interested status");
      }

      const data = await res.json();

      setIsInterested(data.interested);
    } catch (error) {
      console.error(error);
    }
  };

  const getInterestedStatus = async (movieId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/movies/${movieId}/interested-status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch interested status");
      }

      const data = await res.json();

      setIsInterested(data.interested);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchOpinion = async () => {
      try {
        if (!movieDetails?.id) return;
        const res = await fetch(
          `http://localhost:8080/movies/${movieDetails.id}/opinion`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setUserOpinion(data.opinionType);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOpinion();
  }, [movieDetails?.id]);

  useEffect(() => {
    if (!movieDetails?.id) return;

    getInterestedStatus(movieDetails.id);
  }, [movieDetails]);

  // open modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // confirm delete
  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:8080/movies/${movieDetails.id}/opinion`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUserOpinion(null); // 🔥 remove opinion
      setIsEditing(false); // safety
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDuration = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  };

  if (!movieDetails) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const metaParts = [
    "Movie",
    movieDetails.year,
    formatDuration(movieDetails.duration),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="relative w-full">
        <div className="relative w-full h-[420px]">
          {movieDetails.posterWideUrl ? (
            <img
              src={movieDetails.posterWideUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1a1a1a] z-0" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
        </div>

        <div className="absolute inset-0 z-20 flex items-end">
          <div className="w-full max-w-6xl mx-auto px-8 pb-8 flex items-end gap-8">
            <div className="shrink-0 w-[190px] h-[280px] rounded-xl overflow-hidden shadow-2xl">
              {movieDetails.posterSmallUrl ? (
                <img
                  src={movieDetails.posterSmallUrl}
                  alt={movieDetails.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/10 border border-white/10" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-sm mb-1">
                {metaParts.join(" • ")}
              </p>
              <h1 className="text-4xl font-bold mb-5">{movieDetails.name}</h1>

              <div className="flex flex-wrap gap-x-10 gap-y-3">
                {movieDetails.directedBy && (
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Directed By</p>
                    <p className="text-white font-semibold text-sm">
                      {movieDetails.directedBy}
                    </p>
                  </div>
                )}
                {movieDetails.country && (
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Country</p>
                    <p className="text-white font-semibold text-sm">
                      {movieDetails.country}
                    </p>
                  </div>
                )}
                {movieDetails.language && (
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Language</p>
                    <p className="text-white font-semibold text-sm">
                      {movieDetails.language}
                    </p>
                  </div>
                )}
                {movieDetails.ageRating && (
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Age Rating</p>
                    <p className="text-white font-semibold text-sm">
                      {movieDetails.ageRating}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-[260px]">
              <button
                onClick={handleInterested}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-colors text-white font-semibold text-sm ${
                  isInterested
                    ? "bg-orange-500 hover:bg-orange-400"
                    : "bg-orange-300 hover:bg-orange-200 text-black"
                }`}
              >
                {isInterested ? (
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 21s-6-4.35-9-8.28C.9 9.73 2.4 5.5 6.5 5.5c2.04 0 4 1.2 5.5 3.09C13.5 6.7 15.46 5.5 17.5 5.5c4.1 0 5.6 4.23 3.5 7.22C18 16.65 12 21 12 21z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21s-6-4.35-9-8.28C.9 9.73 2.4 5.5 6.5 5.5c2.04 0 4 1.2 5.5 3.09C13.5 6.7 15.46 5.5 17.5 5.5c4.1 0 5.6 4.23 3.5 7.22C18 16.65 12 21 12 21z" />
                  </svg>
                )}

                {isInterested ? "Interested" : "Mark Interested"}
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors text-white font-semibold text-sm">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Add to Collection
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pt-10 pb-20 flex gap-8 items-start">
        <div className="flex-1 min-w-0">
          {movieDetails.overview && (
            <>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>

              <p className="text-white/70 text-base leading-relaxed mb-10">
                {movieDetails.overview}
              </p>
            </>
          )}

          <CastCrew castCrew={movieDetails.castCrew} />
        </div>

        <div className="w-[320px] shrink-0 flex flex-col gap-6">
          {movieDetails.genres?.length > 0 && (
            <VibeChart genres={movieDetails.genres} />
          )}

          {movieDetails.watchLinks?.length > 0 && (
            <WatchOnline links={movieDetails.watchLinks} />
          )}
        </div>
      </div>

      {movieDetails?.id && (
        <div className="max-w-2xl mx-20 px-5 pb-20">
          {!userOpinion ? (
            // 👉 CREATE MODE (no opinion yet)
            <UserOpinionInputCard
              key="create"
              movieId={movieDetails.id}
              isEdit={false}
              onSuccess={(opinionType) => setUserOpinion(opinionType)}
            />
          ) : isEditing ? (
            // 👉 EDIT MODE
            <UserOpinionInputCard
              key="edit"
              movieId={movieDetails.id}
              initialOpinion={userOpinion}
              isEdit={true}
              onSuccess={(opinionType) => {
                setUserOpinion(opinionType); // update data
                setIsEditing(false); // exit edit mode
              }}
              onClose={() => setIsEditing(false)} // close without saving
            />
          ) : (
            // 👉 DISPLAY MODE
            <UserOpinionDisplayCard
              opinionType={userOpinion}
              onEdit={() => setIsEditing(true)} // switch to edit
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-80 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete Review?
            </h3>

            <p className="text-sm text-gray-400 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm text-gray-300 hover:bg-zinc-700 rounded-full"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
