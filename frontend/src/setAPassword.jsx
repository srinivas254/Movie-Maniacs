
import { useState } from "react";
import toast from "react-hot-toast";

import { PasswordField } from "./password.jsx";
import { getPasswordStrength } from "./passwordStrength.js";
import { getPasswordIssues } from "./passwordIssues.js"

export function SetPassword() {

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const strength = getPasswordStrength(password);
  const issues = getPasswordIssues(password);

  const handleSetPassword = async () => {

    if (!strength.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/users/set-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to set password");
      }

      toast.success("Password set successfully");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex-1 max-w-5xl p-6 rounded-xl
                 bg-black/60 backdrop-blur-md
                 border border-white/10 shadow-2xl"
    >
      <h2 className="text-xl font-semibold mb-6">
        Set Password
      </h2>

      <PasswordField
        value={password}
        onChange={(val) => {
          setPassword(val);
          setError("");
        }}
        passwordStrength={strength}
        issues={issues}
        inputClassName="bg-zinc-900 text-white border border-white/10"
        issuesClassName="text-white"
      />

      {error && (
        <p className="text-red-500 text-sm mt-3">
          {error}
        </p>
      )}

      <button
        disabled={!strength.isValid}
        onClick={handleSetPassword}
        className={`mt-5 px-6 py-2 rounded-lg font-medium
          ${
            strength.isValid
              ? "bg-purple-600 hover:bg-purple-500"
              : "bg-zinc-700 cursor-not-allowed opacity-60"
          }
        `}
      >
        Set Password
      </button>
    </div>
  );
}
