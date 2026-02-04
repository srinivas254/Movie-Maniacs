import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useUserStore from "./useUserStore.js";
import toast from "react-hot-toast";
import { useEffect } from "react";

/* ---------------- Schema ---------------- */

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().max(160).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

export function EditProfileCard() {
  const user = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      dateOfBirth: user?.dateOfBirth?.slice(0,10) || "",
      gender: user?.gender || "",
      instagram: user?.instagram || "",
      twitter: user?.twitter || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        bio: user.bio || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : "",
        gender: user.gender || "",
        instagram: user.instagram || "",
        twitter: user.twitter || "",
      });
    }
  }, [user, reset]);

  if (!user) return null;

  /* ---------------- Submit ---------------- */

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      
      const { message, ...profileData } = updatedUser;
      setProfile(profileData);

      toast.success(message);

    } catch (err) {
      console.error(err.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="flex-1 w-full p-6 rounded-xl
                 bg-black/60 backdrop-blur-md
                 border border-white/10 shadow-2xl"
    >
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          {user.pictureUrl ? (
            <img
              src={user.pictureUrl}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full bg-zinc-700
                         flex items-center justify-center
                         text-xl font-bold text-gray-300"
            >
              {user.name
                ?.split(" ")
                .map((word) => word.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="mb-4 flex items-center gap-4">
          <label className="w-32 text-gray-400">Full Name</label>
          <input
            placeholder="Enter your full name"
            {...register("name")}
            className="flex-1 bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        {errors.name && (
          <p className="text-red-500 text-xs px-32 mb-2">
            {errors.name.message}
          </p>
        )}

        {/* Bio */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-gray-400">Bio</label>
          <textarea
            placeholder="Tell about yourself"
            rows="3"
            {...register("bio")}
            className="w-full bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        {/* DOB */}
        <div className="flex items-center gap-4 mb-4">
          <label className="text-gray-400 text-sm">Date of Birth</label>
          <input
            type="date"
            {...register("dateOfBirth")}
            className="w-full bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>
        <p className="text-gray-200 text-xs text-start mb-3">
          This will not be shown publicly. (optional)
        </p>

        {/* Gender */}
        <div className="flex items-center gap-4 mb-4">
          <label className="text-gray-400 text-sm">Gender</label>
          <select
            {...register("gender")}
            className="w-full bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <p className="text-gray-200 text-xs text-start mb-3">
          This will not be shown publicly. (optional)
        </p>

        {/* Divider */}
        <div className="border-t border-white/10 my-6" />

        <p className="text-lg text-gray-400 mb-3">Social Links</p>

        {/* Instagram */}
        <div className="mb-4 flex items-center gap-4">
          <label className="w-32 text-gray-400">Instagram</label>
          <input
            placeholder="Enter your @username"
            {...register("instagram")}
            className="flex-1 bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        {/* Twitter */}
        <div className="mb-6 flex items-center gap-4">
          <label className="w-32 text-gray-400">X</label>
          <input
            placeholder="Enter your @username"
            {...register("twitter")}
            className="flex-1 bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500
                       px-6 py-2 rounded-lg font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
