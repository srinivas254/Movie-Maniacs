export function WatchOnline({ links = [] }) {
  if (!links.length) return null;

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5">
      <h3 className="text-white font-semibold text-lg mb-3">
        Watch Online
      </h3>

      <div className="space-y-2">
        {links.map((l, i) => (
          <a
            key={i}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between group hover:bg-white/5 rounded-xl px-3 py-3 -mx-3 transition-colors cursor-pointer"
          >
            <div>
              <p className="text-white font-semibold text-sm">
                {l.platform}
              </p>
              <p className="text-white/40 text-xs">
                {l.accessType}
              </p>
            </div>

            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}