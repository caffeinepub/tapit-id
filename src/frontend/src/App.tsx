import {
  ArrowRight,
  CheckCircle2,
  Menu,
  RefreshCw,
  Star,
  Wifi,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "oklch(0.975 0.005 240)" }}
    >
      {/* ─── Navigation ────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 nav-blur"
        style={{
          background: "oklch(0.175 0.045 240 / 0.92)",
          borderBottom: "1px solid oklch(1 0 0 / 0.07)",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center" data-ocid="nav.link">
              <img
                src="/assets/generated/tapit-logo-transparent.dim_400x200.png"
                alt="TapIt ID"
                className="h-8 w-auto object-contain"
              />
            </div>

            <div className="hidden md:flex items-center gap-8">
              {["Features", "How It Works", "Pricing", "About"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: "oklch(0.72 0.025 240)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color =
                      "oklch(0.73 0.14 185)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color =
                      "oklch(0.72 0.025 240)";
                  }}
                  data-ocid="nav.link"
                >
                  {link}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                className="text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                style={{ color: "oklch(0.72 0.025 240)" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color =
                    "oklch(0.72 0.025 240)";
                }}
                data-ocid="nav.link"
              >
                Log In
              </button>
              <button
                type="button"
                className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-white"
                style={{ background: "oklch(0.55 0.22 260)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "oklch(0.5 0.22 260)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 20px oklch(0.55 0.22 260 / 0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "oklch(0.55 0.22 260)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
                data-ocid="nav.primary_button"
              >
                Get Started
              </button>
            </div>

            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              data-ocid="nav.toggle"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-4 border-t"
              style={{ borderColor: "oklch(1 0 0 / 0.08)" }}
            >
              <div className="flex flex-col gap-4">
                {["Features", "How It Works", "Pricing", "About"].map(
                  (link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className="text-sm font-medium px-2"
                      style={{ color: "oklch(0.72 0.025 240)" }}
                      onClick={() => setMobileMenuOpen(false)}
                      data-ocid="nav.link"
                    >
                      {link}
                    </a>
                  ),
                )}
                <button
                  type="button"
                  className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white text-center mt-2"
                  style={{ background: "oklch(0.55 0.22 260)" }}
                  data-ocid="nav.primary_button"
                >
                  Get Started Free
                </button>
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────── */}
      {/*
        P0 fix #2: Richer radial hero gradient, Bricolage Grotesque display
        font, controlled line-breaks for typographic moment.
      */}
      <section
        id="how-it-works"
        className="hero-gradient relative overflow-hidden pt-16"
        style={{ minHeight: "100vh" }}
      >
        {/* Noise texture overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: "128px",
          }}
        />

        {/* Ambient glows */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ background: "oklch(0.55 0.22 260 / 0.12)" }}
          />
          <div
            className="absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "oklch(0.68 0.13 185 / 0.08)" }}
          />
          <div
            className="absolute bottom-16 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{ background: "oklch(0.55 0.22 260 / 0.1)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 py-28 lg:py-36">
            {/* Left: Text */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              style={{ maxWidth: "580px" }}
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border"
                style={{
                  background: "oklch(0.68 0.13 185 / 0.12)",
                  borderColor: "oklch(0.68 0.13 185 / 0.25)",
                  color: "oklch(0.78 0.12 185)",
                  letterSpacing: "0.06em",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "oklch(0.73 0.14 185)" }}
                />
                DIGITAL BUSINESS CARDS
              </div>

              {/*
                P0 fix #2: Bricolage Grotesque, very tight tracking,
                forced line structure for maximum impact.
              */}
              <h1
                className="font-display font-extrabold text-white mb-7"
                style={{
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.035em",
                }}
              >
                Your Identity,
                <br />
                <span className="text-gradient-blue">One Tap Away.</span>
              </h1>

              <p
                className="text-lg leading-relaxed mb-10"
                style={{
                  color: "oklch(0.68 0.022 240)",
                  maxWidth: "440px",
                  letterSpacing: "-0.005em",
                }}
              >
                Share your digital business card instantly — no app needed.
                Professional, always up-to-date, and uniquely yours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[15px] font-bold text-white transition-all duration-200"
                  style={{
                    background: "oklch(0.55 0.22 260)",
                    boxShadow:
                      "0 2px 0 oklch(0.42 0.22 260), 0 6px 24px oklch(0.55 0.22 260 / 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(0.5 0.22 260)";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 4px 0 oklch(0.38 0.22 260), 0 12px 36px oklch(0.55 0.22 260 / 0.45)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(0.55 0.22 260)";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 2px 0 oklch(0.42 0.22 260), 0 6px 24px oklch(0.55 0.22 260 / 0.3)";
                  }}
                  data-ocid="hero.primary_button"
                >
                  Create Your Card
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[15px] font-semibold transition-all duration-200 border"
                  style={{
                    color: "oklch(0.88 0.015 240)",
                    borderColor: "oklch(1 0 0 / 0.18)",
                    background: "oklch(1 0 0 / 0.04)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(1 0 0 / 0.09)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "oklch(1 0 0 / 0.32)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(1 0 0 / 0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "oklch(1 0 0 / 0.18)";
                  }}
                  data-ocid="hero.secondary_button"
                >
                  See How It Works
                </button>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 justify-center lg:justify-start">
                {["10K+ Professionals", "No App Required", "Free to Start"].map(
                  (badge) => (
                    <div key={badge} className="flex items-center gap-1.5">
                      <CheckCircle2
                        className="h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: "oklch(0.68 0.13 185)" }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: "oklch(0.62 0.022 240)",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {badge}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </motion.div>

            {/* Right: Business Card */}
            <motion.div
              className="flex-1 flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 48, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="relative" style={{ perspective: "1200px" }}>
                {/* Blue underglow pool */}
                <div
                  className="absolute rounded-3xl blur-3xl"
                  style={{
                    inset: "-20px",
                    background: "oklch(0.55 0.22 260 / 0.22)",
                    zIndex: 0,
                  }}
                />
                {/* Teal rim light  */}
                <div
                  className="absolute rounded-3xl blur-xl"
                  style={{
                    inset: "-4px",
                    background:
                      "linear-gradient(135deg, oklch(0.68 0.13 185 / 0.25), transparent 60%)",
                    zIndex: 0,
                  }}
                />
                <motion.div
                  animate={{ y: [0, -14, 0], rotateZ: [-2, -0.8, -2] }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <img
                    src="/assets/generated/tapit-business-card.dim_800x450.png"
                    alt="TapIt ID Business Card"
                    className="w-full rounded-2xl"
                    style={{
                      maxWidth: "520px",
                      transform: "rotate(-2deg) rotateY(4deg)",
                      boxShadow:
                        "0 40px 80px -10px oklch(0.1 0.04 240 / 0.85), 0 0 0 1px oklch(1 0 0 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.15)",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            role="presentation"
            aria-hidden="true"
          >
            <title>Wave divider</title>
            <path
              d="M0 80L1440 80L1440 40C1200 0 960 80 720 40C480 0 240 80 0 40L0 80Z"
              fill="oklch(0.975 0.005 240)"
            />
          </svg>
        </div>
      </section>

      {/* ─── Card Showcase ─────────────────────────────────────────── */}
      {/*
        P0 fix #1: Dark navy "stage" with multi-layer glow, rimlight, and
        specular border — makes the card read as a physical premium object.
        P1 fix: No redundant badge label; chips replaced with clean pill badges.
      */}
      <section
        id="features"
        className="py-28 relative overflow-hidden"
        style={{ background: "oklch(0.155 0.042 240)" }}
      >
        {/* Ambient stage light */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-3xl"
            style={{ background: "oklch(0.55 0.22 260 / 0.1)" }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-3xl"
            style={{ background: "oklch(0.68 0.13 185 / 0.07)" }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <motion.div
            className="text-center mb-16 section-teal-rule"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display font-extrabold text-white mb-4"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              Your Card,{" "}
              <span className="text-gradient-blue">Beautifully Designed</span>
            </h2>
            <p
              className="text-base max-w-md mx-auto"
              style={{
                color: "oklch(0.58 0.025 240)",
                letterSpacing: "-0.005em",
              }}
            >
              A distinguished digital identity that makes every connection
              memorable.
            </p>
          </motion.div>

          {/* Card on stage */}
          <motion.div
            className="flex justify-center mb-14"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative" style={{ perspective: "1400px" }}>
              {/* Soft ground shadow */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-8"
                style={{
                  width: "75%",
                  height: "40px",
                  background: "oklch(0.55 0.22 260 / 0.4)",
                  filter: "blur(28px)",
                  borderRadius: "50%",
                }}
              />
              <img
                src="/assets/generated/tapit-business-card.dim_800x450.png"
                alt="TapIt ID Business Card Showcase"
                className="relative w-full rounded-2xl card-stage-glow"
                style={{
                  maxWidth: "700px",
                  transform: "rotate(-2deg) rotateX(4deg) rotateY(-2deg)",
                  transformStyle: "preserve-3d",
                }}
              />
            </div>
          </motion.div>

          {/* P1 fix: Clean pill badges — no emoji, dot accent + spaced caps */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {[
              { label: "TAP TO SHARE", dotColor: "oklch(0.55 0.22 260)" },
              { label: "QR CODE INCLUDED", dotColor: "oklch(0.68 0.13 185)" },
              { label: "ALWAYS UP TO DATE", dotColor: "oklch(0.73 0.17 60)" },
            ].map((chip) => (
              <div
                key={chip.label}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border"
                style={{
                  background: "oklch(1 0 0 / 0.04)",
                  borderColor: "oklch(1 0 0 / 0.1)",
                  color: "oklch(0.72 0.025 240)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: chip.dotColor }}
                />
                <span
                  className="text-[11px] font-bold"
                  style={{ letterSpacing: "0.09em" }}
                >
                  {chip.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────── */}
      <section id="pricing" className="py-28" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold mb-5"
              style={{
                background: "oklch(0.68 0.13 185 / 0.1)",
                color: "oklch(0.45 0.1 185)",
                letterSpacing: "0.08em",
              }}
            >
              WHY TAPIT ID
            </div>
            <h2
              className="font-display font-extrabold mb-4"
              style={{
                color: "oklch(0.17 0.04 255)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Everything You Need to{" "}
              <span className="text-gradient-blue">Connect</span>
            </h2>
            <p
              className="text-base max-w-lg mx-auto"
              style={{
                color: "oklch(0.52 0.03 240)",
                letterSpacing: "-0.005em",
              }}
            >
              Simple, powerful, beautiful — TapIt ID redefines how professionals
              share their identity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                icon: Wifi,
                title: "Tap to Connect",
                description:
                  "Share your card with a single tap. No printing, no waste. Just a seamless NFC experience that makes networking effortless.",
                color: "oklch(0.55 0.22 260)",
                bgColor: "oklch(0.55 0.22 260 / 0.08)",
                borderColor: "oklch(0.55 0.22 260 / 0.15)",
                index: 1,
              },
              {
                icon: RefreshCw,
                title: "Instant Updates",
                description:
                  "Update your info anytime. Your contacts always see the latest version — no reprinting, no outdated details, ever.",
                color: "oklch(0.6 0.13 185)",
                bgColor: "oklch(0.68 0.13 185 / 0.08)",
                borderColor: "oklch(0.68 0.13 185 / 0.15)",
                index: 2,
              },
              {
                icon: Star,
                title: "Distinguished Design",
                description:
                  "Professional, minimal cards that make a lasting impression. Stand out with a design that speaks your identity.",
                color: "oklch(0.65 0.17 60)",
                bgColor: "oklch(0.7 0.18 60 / 0.08)",
                borderColor: "oklch(0.7 0.18 60 / 0.15)",
                index: 3,
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl p-8 border transition-all duration-300 cursor-default"
                style={{
                  background: "white",
                  borderColor: "oklch(0.9 0.008 240)",
                  boxShadow: "0 2px 12px 0 oklch(0.17 0.04 255 / 0.05)",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 50px 0 oklch(0.17 0.04 255 / 0.1)",
                }}
                data-ocid={`features.card.${feature.index}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border"
                  style={{
                    background: feature.bgColor,
                    borderColor: feature.borderColor,
                  }}
                >
                  <feature.icon
                    className="h-5 w-5"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3
                  className="text-lg font-bold mb-2.5"
                  style={{
                    color: "oklch(0.17 0.04 255)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.52 0.03 240)" }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────── */}
      <section
        className="py-28"
        style={{ background: "oklch(0.975 0.005 240)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display font-extrabold mb-4"
              style={{
                color: "oklch(0.17 0.04 255)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Up and Running in{" "}
              <span className="text-gradient-blue">3 Easy Steps</span>
            </h2>
            <p
              className="text-base max-w-sm mx-auto"
              style={{ color: "oklch(0.52 0.03 240)" }}
            >
              Get your digital identity live in minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Sign up and fill in your details — name, title, contact info, social links.",
                color: "oklch(0.55 0.22 260)",
                bg: "oklch(0.55 0.22 260 / 0.08)",
              },
              {
                step: "02",
                title: "Choose Your Design",
                desc: "Select a distinguished card design that reflects your professional brand.",
                color: "oklch(0.6 0.13 185)",
                bg: "oklch(0.68 0.13 185 / 0.08)",
              },
              {
                step: "03",
                title: "Share Instantly",
                desc: "Tap, scan, or send your link. Your card is live and always up to date.",
                color: "oklch(0.65 0.17 60)",
                bg: "oklch(0.7 0.18 60 / 0.08)",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.18 }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-extrabold text-2xl mb-6 border"
                  style={{
                    background: step.bg,
                    borderColor: step.color.replace(")", " / 0.2)"),
                    color: step.color,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {step.step}
                </div>
                <h3
                  className="text-lg font-bold mb-2.5"
                  style={{
                    color: "oklch(0.17 0.04 255)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed max-w-xs"
                  style={{ color: "oklch(0.52 0.03 240)" }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section
        id="about"
        className="py-28 relative overflow-hidden"
        style={{ background: "oklch(0.155 0.042 240)" }}
      >
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: "oklch(0.55 0.22 260 / 0.15)" }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: "oklch(0.68 0.13 185 / 0.1)" }}
          />
          {/* Fine grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(oklch(1 0 0 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold mb-8 border"
              style={{
                background: "oklch(0.68 0.13 185 / 0.12)",
                borderColor: "oklch(0.68 0.13 185 / 0.22)",
                color: "oklch(0.73 0.14 185)",
                letterSpacing: "0.07em",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.73 0.14 185)" }}
              />
              JOIN 10,000+ PROFESSIONALS
            </div>

            <h2
              className="font-display font-extrabold text-white mb-6"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
              }}
            >
              Ready to Tap Into
              <br />
              <span className="text-gradient-blue">the Future?</span>
            </h2>

            <p
              className="text-lg mb-10 max-w-xl mx-auto"
              style={{
                color: "oklch(0.6 0.025 240)",
                letterSpacing: "-0.01em",
              }}
            >
              Join thousands of professionals using TapIt ID to make every
              connection count.
            </p>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-12 py-5 rounded-xl text-lg font-bold text-white transition-all duration-200"
              style={{
                background: "oklch(0.55 0.22 260)",
                boxShadow:
                  "0 2px 0 oklch(0.42 0.22 260), 0 8px 32px oklch(0.55 0.22 260 / 0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.5 0.22 260)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 0 oklch(0.38 0.22 260), 0 16px 48px oklch(0.55 0.22 260 / 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.55 0.22 260)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 0 oklch(0.42 0.22 260), 0 8px 32px oklch(0.55 0.22 260 / 0.35)";
              }}
              data-ocid="cta.primary_button"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>

            <p
              className="mt-5 text-xs"
              style={{
                color: "oklch(0.48 0.022 240)",
                letterSpacing: "0.02em",
              }}
            >
              No credit card required · Free forever plan available
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "oklch(0.125 0.038 240)",
          borderTop: "1px solid oklch(1 0 0 / 0.05)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col items-center gap-6">
            <img
              src="/assets/generated/tapit-logo-transparent.dim_400x200.png"
              alt="TapIt ID"
              className="h-9 w-auto object-contain opacity-90"
            />
            <p
              className="text-sm font-medium"
              style={{
                color: "oklch(0.5 0.022 240)",
                letterSpacing: "-0.005em",
              }}
            >
              Your Identity, One Tap Away
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Pricing", href: "#pricing" },
                { label: "Privacy Policy", href: "#about" },
                { label: "Terms", href: "#about" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs transition-colors duration-200"
                  style={{
                    color: "oklch(0.44 0.02 240)",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color =
                      "oklch(0.68 0.13 185)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color =
                      "oklch(0.44 0.02 240)";
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div
              className="w-full h-px"
              style={{ background: "oklch(1 0 0 / 0.05)" }}
            />
            <p
              className="text-xs text-center"
              style={{ color: "oklch(0.38 0.018 240)" }}
            >
              © {currentYear} TapIt ID. All rights reserved. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                className="underline-offset-2 hover:underline transition-colors"
                style={{ color: "oklch(0.52 0.1 185)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
