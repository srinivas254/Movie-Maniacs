import { HomeNavbar } from "./homeNavbar.jsx";
import { HeroSection } from "./hero.jsx";
import { FeaturesSection } from "./features.jsx";
import { WhyusSection } from "./why-us.jsx";
import { HelpSection } from "./help.jsx";
import { PreviewModal } from "./previewBar.jsx";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const [showPreview, setShowPreview] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/explore");
    }
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-black 
    via-neutral-900 to-purple-900"
    >
      <HomeNavbar />

      <main className="flex flex-col">
        <section id="hero">
          <HeroSection />
        </section>

        <section id="features">
          <FeaturesSection />
        </section>

        <section id="why-us">
          <WhyusSection />
        </section>

        <section id="help">
          <HelpSection />
        </section>
      </main>

      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}
