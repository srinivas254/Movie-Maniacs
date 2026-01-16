
export function HelpSection() {
  return (
    <>
    <div className="mb-12 ml-4">
        <div className="w-14 h-px bg-white/30 mb-4 ml-6" />
        <p className="text-sm uppercase tracking-wider text-gray-400">
            Help Us Grow
        </p>
    </div>

    <footer className="w-full bg-black border-t border-white/10 mt-24 py-16">
      <div className="max-w-7xl  flex flex-col md:flex-row justify-evenly 
       gap-12 text-sm text-gray-400">

        {/* BRAND */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-base">
            Movie Maniacs
          </h3>
          <p className="leading-relaxed max-w-xs">
            Discover movies through real opinions, honest ratings, and people
            who truly love cinema.
          </p>
        </div>

        {/* CONNECT */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-base">
            Connect With Us
          </h4>
          <ul className="space-y-2">
            <li className="hover:text-white transition cursor-pointer">
              Contact
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Feedback
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Report an Issue
            </li>
          </ul>
        </div>

        {/* LEGAL */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-base">
            Legal
          </h4>
          <ul className="space-y-2">
            <li className="hover:text-white transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Terms of Service
            </li>
          </ul>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto mt-12 border-t border-white/10" />

      {/* COPYRIGHT */}
      <div className="max-w-7xl mx-auto mt-6 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Movie Maniacs. All rights reserved.
      </div>
    </footer>
    </>
  );
}
