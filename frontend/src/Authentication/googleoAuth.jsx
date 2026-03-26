
export function GoogleOAuthButton({ text,mode }) {

  const handleGoogleAuth = () => {
    window.location.href = `http://localhost:8080/auth/google/${mode}`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="w-full border border-gray-300 
                 py-2 rounded-3xl 
                 flex items-center justify-center gap-2
                 hover:bg-gray-300 transition"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      {text}
    </button>
  );
}
