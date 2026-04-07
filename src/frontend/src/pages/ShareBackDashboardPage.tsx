import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Inbox,
  Mail,
  MessageSquare,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type { ShareBack } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type PageNav =
  | { type: "home" }
  | { type: "view"; phone: string }
  | { type: "edit"; phone: string }
  | { type: "dashboard"; phone: string };

interface ShareBackDashboardPageProps {
  phone: string;
  onNavigate: (page: PageNav) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatTimestamp(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  const now = Date.now();
  const diff = now - ms;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const AVATAR_COLORS = [
  "oklch(0.55 0.22 260)",
  "oklch(0.68 0.13 185)",
  "oklch(0.58 0.18 300)",
  "oklch(0.62 0.16 30)",
  "oklch(0.6 0.14 150)",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function ShareBackCard({ sb, index }: { sb: ShareBack; index: number }) {
  const initials = getInitials(sb.name);
  const avatarColor = getAvatarColor(sb.name);
  const timeLabel = formatTimestamp(sb.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="rounded-2xl p-5 flex gap-4"
      style={{
        background: "oklch(0.175 0.045 240)",
        border: "1px solid oklch(1 0 0 / 0.09)",
      }}
      data-ocid={`dashboard.item.${index + 1}`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white"
          style={{ background: avatarColor }}
        >
          {initials}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-semibold text-base leading-tight truncate"
            style={{ color: "oklch(0.92 0.012 240)" }}
          >
            {sb.name}
          </h3>
          <span
            className="text-xs shrink-0 mt-0.5"
            style={{ color: "oklch(0.48 0.02 240)" }}
          >
            {timeLabel}
          </span>
        </div>

        <div className="space-y-1.5">
          {sb.email && (
            <div className="flex items-center gap-2">
              <Mail
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: "oklch(0.68 0.13 185)" }}
              />
              <a
                href={`mailto:${sb.email}`}
                className="text-sm truncate transition-colors hover:underline"
                style={{ color: "oklch(0.65 0.025 240)" }}
              >
                {sb.email}
              </a>
            </div>
          )}

          {sb.phone && (
            <div className="flex items-center gap-2">
              <Phone
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: "oklch(0.55 0.22 260)" }}
              />
              <a
                href={`tel:${sb.phone}`}
                className="text-sm truncate transition-colors hover:underline"
                style={{ color: "oklch(0.65 0.025 240)" }}
              >
                {sb.phone}
              </a>
            </div>
          )}

          {sb.message && (
            <div className="flex items-start gap-2 mt-2">
              <MessageSquare
                className="h-3.5 w-3.5 shrink-0 mt-0.5"
                style={{ color: "oklch(0.5 0.02 240)" }}
              />
              <p
                className="text-sm italic leading-relaxed"
                style={{
                  color: "oklch(0.58 0.022 240)",
                  borderLeft: "2px solid oklch(1 0 0 / 0.1)",
                  paddingLeft: "0.625rem",
                }}
              >
                &ldquo;{sb.message}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ShareBackDashboardPage({
  phone,
  onNavigate,
}: ShareBackDashboardPageProps) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const { data: shareBacks, isLoading } = useQuery<ShareBack[]>({
    queryKey: ["shareBacks", phone],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getShareBacks(phone);
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  const sorted = shareBacks
    ? [...shareBacks].sort((a, b) =>
        b.timestamp > a.timestamp ? 1 : b.timestamp < a.timestamp ? -1 : 0,
      )
    : [];

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "oklch(0.135 0.042 240)" }}
    >
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "oklch(0.155 0.044 240 / 0.95)",
          borderBottom: "1px solid oklch(1 0 0 / 0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        <nav className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Back link */}
            <button
              type="button"
              onClick={() => onNavigate({ type: "view", phone })}
              className="flex items-center gap-2 text-sm font-medium transition-colors group"
              style={{ color: "oklch(0.65 0.025 240)" }}
              data-ocid="dashboard.back.button"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                style={{ color: "oklch(0.68 0.13 185)" }}
              />
              <span
                className="group-hover:text-white transition-colors"
                style={{ color: "oklch(0.65 0.025 240)" }}
              >
                Back to Card
              </span>
            </button>

            {/* Wordmark */}
            <span className="font-display font-extrabold text-xl leading-none">
              <span className="text-white">TapIt</span>
              <span style={{ color: "oklch(0.68 0.13 185)" }}>ID</span>
            </span>

            {/* Spacer to balance header */}
            <div className="w-24" />
          </div>
        </nav>
      </header>

      {/* ─── Main ───────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Not logged in */}
        {!identity ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="dashboard.locked.panel"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{
                background: "oklch(0.55 0.22 260 / 0.12)",
                border: "1px solid oklch(0.55 0.22 260 / 0.25)",
              }}
            >
              <Inbox
                className="h-9 w-9"
                style={{ color: "oklch(0.62 0.18 260)" }}
              />
            </div>
            <h2
              className="font-display font-extrabold text-2xl mb-3"
              style={{ color: "oklch(0.88 0.015 240)" }}
            >
              Login Required
            </h2>
            <p
              className="text-sm max-w-xs leading-relaxed"
              style={{ color: "oklch(0.5 0.02 240)" }}
            >
              You need to be logged in to view your Share Back inbox. Log in
              with Internet Identity to see who&rsquo;s connected with you.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Page title */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.55 0.22 260 / 0.15)",
                    border: "1px solid oklch(0.55 0.22 260 / 0.28)",
                  }}
                >
                  <Users
                    className="h-4.5 w-4.5"
                    style={{ color: "oklch(0.65 0.2 260)" }}
                  />
                </div>
                <h1
                  className="font-display font-extrabold text-2xl"
                  style={{ color: "oklch(0.92 0.012 240)" }}
                >
                  Connections Inbox
                </h1>
              </div>
              <p
                className="text-sm ml-12"
                style={{ color: "oklch(0.5 0.02 240)" }}
              >
                People who shared back when they scanned your card
              </p>
            </motion.div>

            {/* Stats bar */}
            {!isLoading && sorted.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="rounded-2xl px-5 py-4 mb-6 flex items-center gap-4"
                style={{
                  background: "oklch(0.175 0.045 240)",
                  border: "1px solid oklch(1 0 0 / 0.09)",
                }}
                data-ocid="dashboard.stats.panel"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.68 0.13 185 / 0.14)",
                    border: "1px solid oklch(0.68 0.13 185 / 0.25)",
                  }}
                >
                  <Users
                    className="h-4.5 w-4.5"
                    style={{ color: "oklch(0.72 0.12 185)" }}
                  />
                </div>
                <div>
                  <p
                    className="font-display font-extrabold text-2xl leading-none"
                    style={{ color: "oklch(0.92 0.012 240)" }}
                  >
                    {sorted.length}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.5 0.02 240)" }}
                  >
                    {sorted.length === 1 ? "connection" : "connections"}{" "}
                    received
                  </p>
                </div>
              </motion.div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="space-y-3" data-ocid="dashboard.loading_state">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-5 flex gap-4"
                    style={{
                      background: "oklch(0.175 0.045 240)",
                      border: "1px solid oklch(1 0 0 / 0.09)",
                    }}
                  >
                    <Skeleton
                      className="w-11 h-11 rounded-full shrink-0"
                      style={{ background: "oklch(0.22 0.04 240)" }}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton
                          className="h-4 w-32 rounded"
                          style={{ background: "oklch(0.22 0.04 240)" }}
                        />
                        <Skeleton
                          className="h-3 w-20 rounded"
                          style={{ background: "oklch(0.22 0.04 240)" }}
                        />
                      </div>
                      <Skeleton
                        className="h-3 w-48 rounded"
                        style={{ background: "oklch(0.22 0.04 240)" }}
                      />
                      <Skeleton
                        className="h-3 w-40 rounded"
                        style={{ background: "oklch(0.22 0.04 240)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && sorted.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
                data-ocid="dashboard.empty_state"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: "oklch(0.175 0.045 240)",
                    border: "1px solid oklch(1 0 0 / 0.09)",
                  }}
                >
                  <Users
                    className="h-9 w-9"
                    style={{ color: "oklch(0.38 0.02 240)" }}
                  />
                </div>
                <h3
                  className="font-display font-extrabold text-xl mb-2"
                  style={{ color: "oklch(0.7 0.018 240)" }}
                >
                  No connections yet
                </h3>
                <p
                  className="text-sm max-w-xs leading-relaxed"
                  style={{ color: "oklch(0.48 0.018 240)" }}
                >
                  When someone scans your card and taps &ldquo;Share
                  Back,&rdquo; their info will appear here.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate({ type: "view", phone })}
                  className="mt-6 flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "oklch(0.68 0.13 185 / 0.12)",
                    border: "1px solid oklch(0.68 0.13 185 / 0.28)",
                    color: "oklch(0.72 0.12 185)",
                  }}
                  data-ocid="dashboard.view_card.button"
                >
                  View My Card
                </button>
              </motion.div>
            )}

            {/* Cards list */}
            {!isLoading && sorted.length > 0 && (
              <div className="space-y-3" data-ocid="dashboard.list">
                {sorted.map((sb, i) => (
                  <ShareBackCard
                    key={`${sb.name}-${String(sb.timestamp)}`}
                    sb={sb}
                    index={i}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="py-8 text-center">
        <p className="text-xs" style={{ color: "oklch(0.38 0.02 240)" }}>
          Powered by{" "}
          <span className="font-display font-bold">
            <span style={{ color: "oklch(0.55 0.02 240)" }}>TapIt</span>
            <span style={{ color: "oklch(0.68 0.13 185)" }}>ID</span>
          </span>
        </p>
      </footer>
    </div>
  );
}
