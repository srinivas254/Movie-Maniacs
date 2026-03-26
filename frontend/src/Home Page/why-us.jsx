

export function WhyusSection() {
  return (
    <section className="relative py-24 px-8">

      <div className="max-w-4xl">

        {/* CONTENT */}
        <div className="space-y-8">

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl text-center font-bold text-white leading-tight">
            Why Movie Maniacs?
          </h2>

          <div className="space-y-5 ml-12">
             {/* Core belief */}
          <p className="text-xl text-gray-200 leading-relaxed max-w-3xl">
            Most platforms show you everything.
            <br />
            <span className="text-white font-semibold">
              We help you find what’s actually worth your time.
            </span>
          </p>

          {/* Supporting text */}
          <p className="text-gray-400 text-lg leading-relaxed ">
            This isn’t about endless scrolling, fake hype, or paid reviews.
            It’s about <span className="text-white">real opinions</span>,
            <span className="text-white"> honest ratings</span>, and discovering
            movies through people who love cinema as much as you do.
          </p>

          {/* Value bullets (beliefs, not features) */}
          <ul className="list-disc list-inside text-gray-300 text-base space-y-2 max-w-3xl">
            <li>No algorithmic noise — just meaningful discovery</li>
            <li>Opinions from real people, not paid promotions</li>
            <li>A space built for movie lovers, not metrics</li>
          </ul>

          {/* Closing line */}
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
            Whether you’re exploring what to watch this week, building your own
            collections, or following others with great taste —
            <span className="text-white font-medium">
              {" "}this is a home for cinema lovers.
            </span>
          </p>
          </div>

        </div>
      </div>
    </section>
  );
}
