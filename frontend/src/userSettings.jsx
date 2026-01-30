import { EditProfileCard } from "./editProfile.jsx";

export function UserSettings() {
  return (
    <div
      className="min-h-[calc(100vh-64px)]  w-full text-white flex justify-between items-start 
    gap-6 px-4 pt-24"
    >
      {/* Settings Panel */}
      <div
        className="w-72 p-6 rounded-xl
                   bg-black/60 backdrop-blur-md
                   border border-white/10 shadow-2xl"
      >
        {/* Title */}
        <h2 className="text-xl font-semibold text-center">Settings</h2>

        {/* Options */}
        <div className="flex flex-col gap-2">
          <button
            className="text-left px-4 py-2 rounded-lg
                       hover:bg-white/10 transition"
          >
            Edit Profile
          </button>

          <button
            className="text-left px-4 py-2 rounded-lg
                       hover:bg-red-500/10 text-red-400 transition"
          >
            Delete Account
          </button>
        </div>
      </div>

      <div>
        <EditProfileCard />
      </div>
    </div>
  );
}
