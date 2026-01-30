
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCamera } from "react-icons/fa";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name too short"),
  bio: z.string().max(160).optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  instagram: z.string().optional(),
  x: z.string().optional()
});

export function EditProfileCard() {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema)
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data) => {
    console.log("FORM DATA:", data);
    console.log("IMAGE:", imageFile);
  };

  return (
    <div
      className="flex-1 max-w-4xl p-6 rounded-xl
                 bg-black/60 backdrop-blur-md
                 border border-white/10 shadow-2xl"
    >
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {previewImage ? (
              <img
                src={previewImage}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-zinc-700" />
            )}

            <label
              className="absolute bottom-0 right-0
                         bg-purple-600 p-2 rounded-full
                         cursor-pointer hover:bg-purple-500"
            >
              <FaCamera size={12} />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Full Name */}
        <div className="mb-4 flex items-center gap-4">
          <label className="w-32 text-gray-400">Full Name</label>
          <input
            {...register("fullName")}
            className="flex-1 bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-sm mb-2">
            {errors.fullName.message}
          </p>
        )}

        {/* Bio */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-gray-400">Bio</label>
          <textarea
            rows="3"
            {...register("bio")}
            className="w-full mt-1 bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        {/* DOB + Gender */}
        <div className="flex items-center gap-4 mb-4">
            <label className="text-gray-400 text-sm">
              Date of Birth (Private)
            </label>
            <input
              type="date"
              {...register("dob")}
              className="w-full mt-1 bg-zinc-900 rounded-lg px-3 py-2 outline-none"
            />
        </div>

        <div className="flex items-center gap-4 mb-4">
            <label className="text-gray-400 text-sm">
              Gender (Private)
            </label>
            <select
              {...register("gender")}
              className="w-full mt-1 bg-zinc-900 rounded-lg px-3 py-2 outline-none"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-6" />

        <p className="text-lg text-gray-400 mb-3">Social Links</p>

        {/* Instagram */}
        <div className="mb-4 flex items-center gap-4">
          <label className="w-32 text-gray-400">Instagram</label>
          <input
            placeholder="username"
            {...register("instagram")}
            className="flex-1 bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        {/* X */}
        <div className="mb-6 flex items-center gap-4">
          <label className="w-32 text-gray-400">X</label>
          <input
            placeholder="username"
            {...register("x")}
            className="flex-1 bg-zinc-900 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        {/* Save Button */}
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
