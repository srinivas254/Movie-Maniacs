import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export function PasswordField({ value, onChange, passwordStrength, issues }) {
  const [showPassword, setShowPassword] = useState(false);

  const strengthBars = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-400",
    "bg-green-500",
    "bg-blue-700",
  ];

  return (
    <div className="space-y-2">
      {/* Password input */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10
          focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div
            key={index}
            className={`h-[2px] flex-1 rounded ${
              index < passwordStrength.level
                ? strengthBars[passwordStrength.level - 1]
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Strength text */}
      {passwordStrength.level > 0 && (
        <p className={`text-sm font-medium ${passwordStrength.textColor}`}>
          {passwordStrength.label}
        </p>
      )}

      {issues.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {issues.map((issue, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>{issue}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
