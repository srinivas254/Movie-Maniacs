import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";

export function NotificationsModal() {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-80 bg-black/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md z-50">
      
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-white text-sm font-semibold tracking-wide">Notifications</span>
        <button className="text-white/40 hover:text-white transition">
          <ArchiveBoxXMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="h-[1px] bg-white/10" />

      <div className="p-4 text-white/40 text-xs text-center py-10">
        No notifications yet
      </div>
    </div>
  );
}