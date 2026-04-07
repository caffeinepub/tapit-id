import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  Edit2,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import type { Profile } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type PageNav = { type: "home" } | { type: "edit"; phone: string };

interface ProfileCardPageProps {
  phone: string;
  onNavigate: (page: PageNav) => void;
  successMessage?: string;
}

function generateVCF(profile: Profile): string {
  const nField = `N:${profile.lastName};${profile.firstName};;;`;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.firstName} ${profile.lastName}`,
    nField,
    profile.jobTitle ? `TITLE:${profile.jobTitle}` : "",
    profile.company ? `ORG:${profile.company}` : "",
    profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
    profile.email ? `EMAIL:${profile.email}` : "",
    profile.website ? `URL:${profile.website}` : "",
    profile.address.street || profile.address.city
      ? `ADR;TYPE=HOME:;;${profile.address.street};${profile.address.city};${profile.address.state};${profile.address.zip};${profile.address.country}`
      : "",
    profile.socialLinks.linkedin
      ? `URL;TYPE=LINKEDIN:${profile.socialLinks.linkedin}`
      : "",
    profile.socialLinks.twitter
      ? `URL;TYPE=TWITTER:${profile.socialLinks.twitter}`
      : "",
    profile.bio ? `NOTE:${profile.bio.replace(/\n/g, "\\n")}` : "",
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n");
}

function downloadVCF(profile: Profile) {
  const content = generateVCF(profile);
  const blob = new Blob([content], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${profile.firstName}_${profile.lastName}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ProfileCardPage({
  phone,
  onNavigate,
  successMessage,
}: ProfileCardPageProps) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const { data: record, isLoading } = useQuery({
    queryKey: ["profile", phone],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfile(phone);
    },
    enabled: !!actor && !isFetching,
  });

  const profile = record?.profile ?? null;
  const isOwner = !!identity;

  const fullAddress = [
    profile?.address.street,
    profile?.address.city,
    profile?.address.state,
    profile?.address.zip,
    profile?.address.country,
  ]
    .filter(Boolean)
    .join(", ");

  const socialLinks = profile
    ? [
        {
          icon: SiLinkedin,
          url: profile.socialLinks.linkedin,
          label: "LinkedIn",
        },
        { icon: SiX, url: profile.socialLinks.twitter, label: "X" },
        {
          icon: SiInstagram,
          url: profile.socialLinks.instagram,
          label: "Instagram",
        },
        {
          icon: SiFacebook,
          url: profile.socialLinks.facebook,
          label: "Facebook",
        },
      ].filter((s) => !!s.url)
    : [];

  const initials = profile
    ? `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()
    : "?";

  const [profileImage, setProfileImage] = useState<string | null>(null);
  useEffect(() => {
    if (phone) {
      const stored = localStorage.getItem(`profileImage_${phone}`);
      setProfileImage(stored);
    }
  }, [phone]);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "oklch(0.135 0.042 240)" }}
    >
      {/* Ambient glows */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "oklch(0.55 0.22 260 / 0.12)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "oklch(0.68 0.13 185 / 0.08)" }}
        />
      </div>

      {/* Nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "oklch(0.155 0.045 240 / 0.92)",
          borderBottom: "1px solid oklch(1 0 0 / 0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate({ type: "home" })}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "oklch(0.62 0.025 240)" }}
            data-ocid="profile.back.link"
          >
            <ArrowLeft className="h-4 w-4" />
            TapIt ID
          </button>
          {isOwner && profile && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onNavigate({ type: "edit", phone })}
              className="flex items-center gap-1.5 text-xs"
              style={{
                borderColor: "oklch(1 0 0 / 0.15)",
                color: "oklch(0.8 0.015 240)",
                background: "transparent",
              }}
              data-ocid="profile.edit.secondary_button"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Card
            </Button>
          )}
        </div>
      </header>

      <main className="pt-24 pb-20 max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Success banner */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2"
            style={{
              background: "oklch(0.68 0.13 185 / 0.15)",
              borderColor: "oklch(0.68 0.13 185 / 0.3)",
              border: "1px solid",
              color: "oklch(0.78 0.12 185)",
            }}
            data-ocid="profile.success_state"
          >
            ✓ {successMessage}
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-4" data-ocid="profile.loading_state">
            <div
              className="rounded-3xl p-8"
              style={{
                background: "oklch(0.175 0.045 240)",
                border: "1px solid oklch(1 0 0 / 0.08)",
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <Skeleton
                  className="w-24 h-24 rounded-full"
                  style={{ background: "oklch(0.22 0.04 240)" }}
                />
                <Skeleton
                  className="w-48 h-7"
                  style={{ background: "oklch(0.22 0.04 240)" }}
                />
                <Skeleton
                  className="w-32 h-4"
                  style={{ background: "oklch(0.22 0.04 240)" }}
                />
              </div>
            </div>
          </div>
        ) : !profile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
            data-ocid="profile.not-found.card"
          >
            <div className="text-6xl mb-6">📇</div>
            <h1 className="font-display font-bold text-2xl mb-3 text-white">
              Card Not Found
            </h1>
            <p
              className="text-sm mb-8"
              style={{ color: "oklch(0.55 0.025 240)" }}
            >
              No profile found for this identifier.
            </p>
            <Button
              type="button"
              onClick={() => onNavigate({ type: "home" })}
              className="text-white font-semibold"
              style={{ background: "oklch(0.55 0.22 260)" }}
              data-ocid="profile.home.primary_button"
            >
              Go to Home
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
            data-ocid="profile.card"
          >
            {/* Hero card */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.19 0.05 240), oklch(0.155 0.042 240))",
                border: "1px solid oklch(1 0 0 / 0.09)",
                boxShadow:
                  "0 32px 64px -12px oklch(0.08 0.04 240 / 0.8), 0 0 0 1px oklch(1 0 0 / 0.05)",
              }}
            >
              {/* Top gradient bar */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.55 0.22 260), oklch(0.68 0.13 185))",
                }}
              />

              <div className="p-8 sm:p-10">
                {/* Avatar + name */}
                <div className="flex flex-col items-center text-center mb-8">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-24 h-24 rounded-full object-cover mb-5"
                      style={{
                        boxShadow: "0 8px 24px oklch(0.55 0.22 260 / 0.35)",
                        border: "3px solid oklch(0.55 0.22 260 / 0.3)",
                      }}
                    />
                  ) : (
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center mb-5 text-3xl font-display font-extrabold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.55 0.22 260), oklch(0.68 0.13 185))",
                        color: "white",
                        boxShadow: "0 8px 24px oklch(0.55 0.22 260 / 0.35)",
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  <h1
                    className="font-display font-extrabold text-white mb-1.5"
                    style={{
                      fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {profile.firstName} {profile.lastName}
                  </h1>
                  {(profile.jobTitle || profile.company) && (
                    <p
                      className="text-sm"
                      style={{ color: "oklch(0.65 0.025 240)" }}
                    >
                      {[profile.jobTitle, profile.company]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>

                {/* Contact rows */}
                <div className="space-y-3 mb-8">
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/10"
                      style={{
                        background: "oklch(1 0 0 / 0.04)",
                        color: "oklch(0.8 0.025 240)",
                      }}
                      data-ocid="profile.phone.link"
                    >
                      <Phone
                        className="h-4 w-4 shrink-0"
                        style={{ color: "oklch(0.68 0.13 185)" }}
                      />
                      <span className="text-sm">{profile.phone}</span>
                    </a>
                  )}
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/10"
                      style={{
                        background: "oklch(1 0 0 / 0.04)",
                        color: "oklch(0.8 0.025 240)",
                      }}
                      data-ocid="profile.email.link"
                    >
                      <Mail
                        className="h-4 w-4 shrink-0"
                        style={{ color: "oklch(0.68 0.13 185)" }}
                      />
                      <span className="text-sm">{profile.email}</span>
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/10"
                      style={{
                        background: "oklch(1 0 0 / 0.04)",
                        color: "oklch(0.8 0.025 240)",
                      }}
                      data-ocid="profile.website.link"
                    >
                      <Globe
                        className="h-4 w-4 shrink-0"
                        style={{ color: "oklch(0.68 0.13 185)" }}
                      />
                      <span className="text-sm truncate">
                        {profile.website.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                  )}
                  {fullAddress && (
                    <div
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{
                        background: "oklch(1 0 0 / 0.04)",
                        color: "oklch(0.8 0.025 240)",
                      }}
                    >
                      <MapPin
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: "oklch(0.68 0.13 185)" }}
                      />
                      <span className="text-sm">{fullAddress}</span>
                    </div>
                  )}
                </div>

                {/* Social icon row */}
                {socialLinks.length > 0 && (
                  <div className="flex justify-center gap-3 mb-8">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                        style={{
                          background: "oklch(1 0 0 / 0.07)",
                          border: "1px solid oklch(1 0 0 / 0.1)",
                        }}
                        title={s.label}
                        data-ocid="profile.social.link"
                      >
                        <s.icon
                          className="h-4 w-4"
                          style={{ color: "oklch(0.75 0.025 240)" }}
                        />
                      </a>
                    ))}
                  </div>
                )}

                {/* Bio */}
                {profile.bio && (
                  <div
                    className="p-4 rounded-xl mb-8"
                    style={{
                      background: "oklch(1 0 0 / 0.04)",
                      border: "1px solid oklch(1 0 0 / 0.06)",
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.65 0.025 240)" }}
                    >
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Save Contact */}
                <Button
                  type="button"
                  onClick={() => downloadVCF(profile)}
                  className="w-full text-white font-semibold py-3 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.22 260), oklch(0.5 0.2 280))",
                    boxShadow: "0 4px 20px oklch(0.55 0.22 260 / 0.3)",
                  }}
                  data-ocid="profile.save-contact.primary_button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save Contact
                </Button>
              </div>
            </div>

            {/* Footer branding */}
            <div className="text-center py-4">
              <p className="text-xs" style={{ color: "oklch(0.38 0.02 240)" }}>
                Powered by{" "}
                <span className="font-display font-bold">
                  <span style={{ color: "oklch(0.65 0.02 240)" }}>TapIt</span>
                  <span style={{ color: "oklch(0.68 0.13 185)" }}>ID</span>
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
