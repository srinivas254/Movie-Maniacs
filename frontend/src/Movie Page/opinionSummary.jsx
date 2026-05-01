import { useEffect, useState, useMemo } from "react";

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 180) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export const OpinionMeter = ({ movieId }) => {
  const [data, setData] = useState(null);
  const [activeLabel, setActiveLabel] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/movies/${movieId}/opinion-summary`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, [movieId]);

  const opinions = useMemo(() => {
    if (!data) return [];
    const {
      skipVotes, timePassVotes, goForItVotes, perfectionVotes,
      skipPercentage, timePassPercentage, goForItPercentage, perfectionPercentage,
    } = data;
    return [
      { label: "Skip",       color: "#ec4899", percentage: skipPercentage,       votes: skipVotes },
      { label: "Timepass",   color: "#eab308", percentage: timePassPercentage,   votes: timePassVotes },
      { label: "Go for it",  color: "#10b981", percentage: goForItPercentage,    votes: goForItVotes },
      { label: "Perfection", color: "#a855f7", percentage: perfectionPercentage, votes: perfectionVotes },
    ];
  }, [data]);

  const defaultLabel = useMemo(() => {
    if (!opinions.length) return null;
    return opinions.reduce((a, b) =>
      b.percentage > a.percentage ? b : a
    ).label;
  }, [opinions]);

  const resolvedLabel = activeLabel ?? defaultLabel;
  const activeItem = opinions.find((o) => o.label === resolvedLabel);

  if (!data) {
    return <div className="text-white p-6">Loading...</div>;
  }

  const cx = 110, cy = 105, r = 90;
  let cumDeg = 0;

  return (
    <div className="text-white p-6 rounded-xl w-full max-w-md">
      <h2 className="text-xl font-semibold mb-6">Opinion Meter</h2>

      <div className="flex justify-center items-center relative">
        <svg width="220" height="120" viewBox="0 0 220 120">
          {/* Background track */}
          <path
            d={describeArc(cx, cy, r, 0, 180)}
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="14"
          />

          {/* Colored arc segments */}
          {opinions.map((item) => {
            const span = (item.percentage / 100) * 180;
            const start = cumDeg;
            const end = cumDeg + span;
            cumDeg += span;

            if (span < 0.01) return null;

            const isActive = item.label === resolvedLabel;

            return (
              <g key={item.label}>
                {/* Invisible hover area (better UX) */}
                <path
                  d={describeArc(cx, cy, r, start, end)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="24"
                  onMouseEnter={() => setActiveLabel(item.label)}
                  onMouseLeave={() => setActiveLabel(null)}
                />

                {/* Visible arc */}
                <path
                  d={describeArc(cx, cy, r, start, end)}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={isActive ? 18 : 12}
                  strokeLinecap="butt"
                  opacity={isActive ? 1 : 0.35}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Center label */}
        {activeItem && (
          <div
            className="absolute text-center"
            style={{
              top: 40,
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none"
            }}
          >
            <p
              className="text-3xl font-bold"
              style={{ color: activeItem.color }}
            >
              {Math.round(activeItem.percentage)}%
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {activeItem.votes.toLocaleString()}/
              {data.totalVotes.toLocaleString()} Votes
            </p>
          </div>
        )}
      </div>

      {/* Legend dots */}
      <div className="flex justify-between mt-6 text-sm">
        {opinions.map((item) => {
          const isActive = item.label === resolvedLabel;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded-md"
              style={{ transition: "background 0.15s" }}
              onMouseEnter={() => setActiveLabel(item.label)}
              onMouseLeave={() => setActiveLabel(null)}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: item.color }}
              />
              <span
                style={{
                  color: isActive ? "#ffffff" : "#9ca3af",
                  fontWeight: isActive ? 500 : 400
                }}
              >
                {item.label} {Math.round(item.percentage)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};