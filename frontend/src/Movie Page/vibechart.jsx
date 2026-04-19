import { useRef, useState, useEffect } from "react";

const GENRE_COLORS = [
  "#A855F7", "#3B82F6", "#EF4444", "#F97316", "#10B981",
  "#EC4899", "#F59E0B", "#06B6D4", "#8B5CF6", "#84CC16",
];

export function VibeChart({ genres = [] }) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const slices = [...genres]
  .sort((a, b) => b.percentage - a.percentage)
  .map((g, i) => ({
    ...g,
    color: GENRE_COLORS[i % GENRE_COLORS.length],
  }));

const topGenre = slices[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || slices.length === 0) return;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const R = 80;
    const r = 52;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let startAngle = -Math.PI / 2;
    slices.forEach((s, i) => {
      const sweep = (s.percentage / 100) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, R, startAngle, startAngle + sweep);
      ctx.arc(cx, cy, r, startAngle + sweep, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = hovered === i ? s.color : s.color + "cc";
      ctx.fill();
      startAngle += sweep;
    });
  }, [slices, hovered]);

  const handleCanvasHover = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;

    const dist = Math.sqrt(x * x + y * y);
    if (dist < 52 || dist > 80) {
      setHovered(null);
      return;
    }

    let angle = Math.atan2(y, x);
    if (angle < -Math.PI / 2) angle += 2 * Math.PI;

    let startAngle = -Math.PI / 2;
    for (let i = 0; i < slices.length; i++) {
      const sweep = (slices[i].percentage / 100) * 2 * Math.PI;
      if (angle >= startAngle && angle < startAngle + sweep) {
        setHovered(i);
        return;
      }
      startAngle += sweep;
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5">
      <h3 className="text-white font-semibold text-lg mb-4">Vibe Chart</h3>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={180}
            height={180}
            onMouseMove={handleCanvasHover}
            onMouseLeave={() => setHovered(null)}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-white font-semibold text-sm">
              {(hovered !== null ? slices[hovered] : topGenre)?.name}
            </p>
            <p className="text-white font-bold text-xl">
              {(hovered !== null ? slices[hovered] : topGenre)?.percentage}%
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {slices.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-white/70 text-sm">{s.name}</span>
            </div>
            <span className="text-white/70 text-sm font-medium">
              {s.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}