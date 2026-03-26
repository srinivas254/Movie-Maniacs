import {
  SparklesIcon,
  Squares2X2Icon,
  StarIcon,
  UserGroupIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: SparklesIcon,
    title: "Explore what’s worth watching",
    desc: "Weekly top picks from Netflix, Prime, Hotstar & Crunchyroll — curated, not cluttered.",
  },
  {
    icon: Squares2X2Icon,
    title: "Browse your way",
    desc: "Discover movies and series by genre, language, anime, franchise, or favorites.",
  },
  {
    icon: StarIcon,
    title: "Rate & react honestly",
    desc: "Skip, Timepass, Go for it, or Perfection — plus short comments that actually matter.",
  },
  {
    icon: UserGroupIcon,
    title: "Profiles & collections",
    desc: "Create your own movie collections — public or private — and build your taste profile.",
  },
  {
    icon: BellIcon,
    title: "Followers & notifications",
    desc: "Follow movie lovers, get notified when someone likes or replies to your review.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-28 px-8">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] 
      gap-10 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-7">
          <h2 className="text-5xl ml-14 font-bold text-white leading-tight">
            Built for Bingers
          </h2>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 items-start group"
              >
                <div className="flex-shrink-0 bg-purple-500/10 border border-purple-500/30 rounded-xl p-3
                                group-hover:bg-purple-500/20 transition">
                  <feature.icon className="h-4 w-4 text-purple-400" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm  whitespace-nowrap overflow-hidden text-ellipsis">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PLACEHOLDER (FOR APP IMAGES LATER) */}
        <div className="relative hidden lg:block">
          <div className="absolute -inset-6 bg-purple-500/20 blur-3xl rounded-full" />

          <div className="relative h-[400px] max-w-[400px] ml-auto rounded-2xl border border-white/10
                          bg-black/40 backdrop-blur-xl
                          flex items-center justify-center text-gray-500 text-sm">
            App screenshots coming here
          </div>
        </div>

      </div>
    </section>
  );
}
