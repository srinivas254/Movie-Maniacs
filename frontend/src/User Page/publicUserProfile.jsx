import { UsersIcon } from "@heroicons/react/24/solid";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Logo } from "../siteLogo";

export function PublicUserProfile() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/users/${userName}`);
        if (!res.ok) {
          throw new Error("User not found");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [userName]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-black via-neutral-900 to-neutral-800">
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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-purple-900 text-white pt-6 pl-4">
      <div className="cursor-pointer">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <Logo className="text-xl" />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-xl w-80">
          {profile.pictureUrl ? (
            <img
              src={profile.pictureUrl}
              alt={profile.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-zinc-700 flex items-center justify-center text-6xl font-bold text-gray-300">
              {initials}
            </div>
          )}

          <h2 className="text-xl text-center font-semibold">{profile.name}</h2>

          <p className="text-center text-xs font-semibold text-gray-400 mb-2">
            @{profile.userName}
          </p>

          <p className="text-center text-sm text-gray-300 mb-4">
            {profile.bio || "No bio available"}
          </p>

          <div className="flex justify-center items-center gap-2">
            <UsersIcon className="w-5 h-4" />
            <span className="font-semibold">{profile.followersCount ?? 0}</span>
            <span className="text-sm">Followers</span>
            <span className="text-gray-500">•</span>
            <span className="font-semibold">{profile.followingCount ?? 0}</span>
            <span className="text-sm">Following</span>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            {profile.instagram && (
              <a
                href={`https://www.instagram.com/${profile.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-400 transition"
              >
                <FaInstagram />
              </a>
            )}

            {profile.twitter && (
              <a
                href={`https://x.com/${profile.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 transition"
              >
                <FaXTwitter />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
