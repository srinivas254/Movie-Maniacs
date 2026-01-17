import { MovieReel } from "./heroMovie"
import { hollywoodPosters,webSeriesPosters,animePosters } from "./movieData"
import { useNavigate } from "react-router-dom"


export function HeroSection() {
    const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Discover Movies <br />
            <span className="text-purple-400">Worth Your Time</span>
          </h1>

          <p className="text-gray-300 text-lg max-w-md">
            Every great movie deserves the right audience —
            <br />
            Find yours here.
          </p>

          <div className="flex gap-4">
            <button
            onClick = {() => navigate("/login")} 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
              Login to Explore
            </button>

            <a href="#features"
             className="inline-block px-6 py-3 border border-purple-500/40 text-purple-300
              rounded-lg hover:bg-purple-500/10 transition">
              Preview Features
            </a>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full" />

          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <p className="text-gray-400 text-sm mb-3">Trending Picks</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                <MovieReel posters={hollywoodPosters} />
              </ div>
              <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                <MovieReel posters={webSeriesPosters} />
              </div>
              <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden">
                <MovieReel posters={animePosters} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
