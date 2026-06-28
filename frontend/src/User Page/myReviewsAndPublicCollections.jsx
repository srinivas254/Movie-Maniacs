import { useState, useEffect } from "react";
import { FolderOpenIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { PublicCollectionCard } from "./PublicCollectionCard";

const banners = [
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200",
];

export function MyReviewsAndPublicCollections({ isPublic = false }) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [collections, setCollections] = useState([]);
  const { userName } = useParams();
  const navigate = useNavigate();

  const opinionLabels = {
    SKIP: "Skip",
    TIME_PASS: "Timepass",
    GO_FOR_IT: "Go For It",
    PERFECTION: "Perfection",
  };

  const opinionColors = {
    SKIP: "bg-pink-500",
    TIME_PASS: "bg-yellow-500",
    GO_FOR_IT: "bg-emerald-500",
    PERFECTION: "bg-purple-500",
  };

  useEffect(() => {
    const reviewUrl = isPublic
      ? `http://localhost:8080/users/${userName}/reviews`
      : `http://localhost:8080/users/me/reviews`;

    const fetchReviews = async () => {
      try {
        const res = await fetch(reviewUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch reviews");
        }

        console.log(data);
        setReviews(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, [userName, isPublic]);

  useEffect(() => {
    const collectionsUrl = isPublic
      ? `http://localhost:8080/users/${userName}/collections/public`
      : `http://localhost:8080/users/me/collections/public`;

    const fetchPublicCollections = async () => {
      try {
        const res = await fetch(collectionsUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch collections");
        }

        const updatedCollections = data.map((collection) => ({
          ...collection,
          banner: banners[collection.id % banners.length],
        }));

        setCollections(updatedCollections);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPublicCollections();
  }, [userName, isPublic]);

  return (
    <div
      className="  bg-neutral-900
    rounded-2xl
    p-6
    flex-1
    h-fit
    self-start"
    >
      <div className="flex w-full gap-4 border-b border-neutral-800 pb-4">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === "reviews"
              ? "bg-neutral-700 text-white"
              : "bg-neutral-800 text-neutral-400"
          }`}
        >
          <PencilSquareIcon className="w-5 h-5" />
          Reviews
        </button>

        <button
          onClick={() => setActiveTab("collections")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === "collections"
              ? "bg-neutral-700 text-white"
              : "bg-neutral-800 text-neutral-400"
          }`}
        >
          <FolderOpenIcon className="w-5 h-5 flex-shrink-0" />
          <span>Collections</span>
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "reviews" && (
          <div>
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <PencilSquareIcon className="w-12 h-12 text-neutral-600 mb-3" />
                <h3 className="text-white font-semibold text-lg">
                  No reviews yet
                </h3>
                <p className="text-neutral-400 text-sm mt-1 max-w-xs">
                  Movies you review will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.opinionId}
                    className="flex gap-5 border-b border-neutral-800 pb-6"
                  >
                    <img
                      src={review.smallPosterUrl}
                      alt={review.movieName}
                      onClick={() => navigate(`/movie/${review.slugUrl}`)}
                      className="w-22 h-32 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition"
                    />

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between w-full">
                        <h3 className="text-xl font-bold text-white truncate">
                          {review.movieName}
                        </h3>

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white flex-shrink-0 ${
                            opinionColors[review.opinionType]
                          }`}
                        >
                          {opinionLabels[review.opinionType]}
                        </span>
                      </div>

                      <span className="text-gray-300 text-sm drop-shadow-[0_0_4px_rgba(255,255,255,0.35)]">
                        Movie • {review.year}
                      </span>

                      {review.comments && (
                        <p className="text-neutral-300 mt-4 text-sm max-w-2xl leading-relaxed">
                          {review.comments}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "collections" && (
          <div>
            {collections.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <FolderOpenIcon className="w-12 h-12 text-neutral-600 mb-3" />

                <h3 className="text-white font-semibold text-lg">
                  No public collections
                </h3>

                <p className="text-neutral-400 text-sm mt-1 max-w-xs">
                  Public collections created by this user will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {collections.map((collection) => (
                  <PublicCollectionCard
                    key={collection.id}
                    collection={collection}
                    userName={userName}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
