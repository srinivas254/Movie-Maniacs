import { UsersIcon } from "@heroicons/react/24/solid";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import useUserStore from "../Zustand Store/useUserStore.js";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const profile = useUserStore((state) => state.profile);
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen text-white flex justify-start items-center p-8 gap-10">
      <div className="bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-xl w-80">

        {profile.pictureUrl ? (
          <img
            src={profile.pictureUrl}
            alt={`${profile.name} profile`}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-zinc-700 flex items-center justify-center text-6xl font-bold text-gray-300">
            {initials}
          </div>
        )}

        <h2 className="text-xl text-center font-semibold">
          {profile.name}
        </h2>

        <p className="text-center text-xs font-semibold text-gray-400 mb-2">
          @{profile.userName}
        </p>

        {profile.bio ? (
          <p className="text-center text-sm text-gray-300 mb-4">
            {profile.bio}
          </p>
        ) : (
          <p className="text-center text-sm text-gray-500 mb-4 italic">
            Add a bio...
          </p>
        )}

        <div className="flex justify-center items-center gap-2">
          <UsersIcon className="w-5 h-4" />
          <span className="font-semibold text-white">
            {profile.followersCount ?? 0}
          </span>
          <span className="text-sm">Followers</span>
          <span className="text-gray-500">•</span>
          <span className="font-semibold text-white">
            {profile.followingCount ?? 0}
          </span>
          <span className="text-sm">Following</span>
        </div>

        <div className="flex justify-center gap-4 mb-5 mt-3">
          {profile.instagram && (
            <a
              href={`https://www.instagram.com/${profile.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 transition"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
          )}

          {profile.twitter && (
            <a
              href={`https://x.com/${profile.twitter}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 transition"
            >
              <FaXTwitter className="w-4 h-4" />
            </a>
          )}
        </div>

        <button
          className="w-full bg-zinc-800 hover:bg-zinc-700 py-2 rounded-lg transition"
          onClick={() => navigate("/settings/edit-profile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}