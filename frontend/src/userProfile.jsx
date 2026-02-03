import { getMyProfile } from "./myProfileResponse.js";
import { useEffect, useState } from "react";
import { UsersIcon } from "@heroicons/react/24/solid";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import useUserStore from "./useUserStore.js";

export function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (!profile && loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen text-white flex justify-start items-center p-8 gap-10">
      <div
        className="bg-black/60 backdrop-blur-md border border-white/10
 p-6 rounded-xl w-80"
      >
        {/* Avatar */}
        {profile.pictureUrl ? (
          <img
            src={profile.pictureUrl}
            alt="profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <div
            className="w-32 h-32 rounded-full mx-auto mb-4 
                       bg-zinc-700 flex items-center justify-center 
                       text-6xl font-bold text-gray-300"
          >
            {profile.name
              ?.split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}

        {/* Name */}
        <h2 className="text-xl text-center font-semibold">{profile.name}</h2>

        {/* Username */}
        <p className="text-center text-xs font-semibold text-gray-400 mb-2">
          @{profile.userName}
        </p>

        {/* Bio */}
        {profile.bio ? (
          <p className="text-center text-sm text-gray-300 mb-4">
            {profile.bio}
          </p>
        ) : (
          <p className="text-center text-sm text-gray-500 mb-4 italic">
            Add a bio...
          </p>
        )}

        {/* Followers / Following */}
        <div className="flex justify-center items-center gap-2">
          <UsersIcon className="w-5 h-4" />
          <span className="font-semibold text-white">
            {profile.followersCount}
          </span>
          <span className="text-sm">Followers</span>
          <span className="text-gray-500">•</span>
          <span className="font-semibold text-white">
            {profile.followingCount}
          </span>
          <span className="text-sm">Following</span>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-5 mt-3">
          {profile.instagram && (
            <a
              href={profile.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 cursor-pointer"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
          )}

          {profile.twitter && (
            <a
              href={profile.twitter}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 cursor-pointer"
            >
              <FaXTwitter className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Edit Button */}
        <button className="w-full bg-zinc-800 hover:bg-zinc-700 py-2 rounded-lg">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
