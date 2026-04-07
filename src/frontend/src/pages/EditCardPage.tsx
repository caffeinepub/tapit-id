import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Briefcase,
  Camera,
  Heart,
  Loader2,
  MapPin,
  Phone,
  Share2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type PageNav = { type: "home" } | { type: "view"; phone: string };

interface EditCardPageProps {
  phone: string;
  onNavigate: (page: PageNav) => void;
}

const sections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "contact", label: "Contact Details", icon: Phone },
  { id: "address", label: "Address", icon: MapPin },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "about", label: "About", icon: Briefcase },
  { id: "upsell", label: "Optional Services", icon: Heart },
];

export function EditCardPage({ phone, onNavigate }: EditCardPageProps) {
  const { actor, isFetching } = useActor();
  const { identity, login } = useInternetIdentity();
  const [activeSection, setActiveSection] = useState("personal");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setFormState] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    company: "",
    email: "",
    website: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
    bio: "",
    hasPets: false,
    hasElderlyLovedOnes: false,
  });

  const { data: record, isLoading } = useQuery({
    queryKey: ["profile", phone],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfile(phone);
    },
    enabled: !!actor && !isFetching,
  });

  useEffect(() => {
    if (record?.profile && !initialized) {
      const p = record.profile;
      setFormState({
        firstName: p.firstName,
        lastName: p.lastName,
        jobTitle: p.jobTitle,
        company: p.company,
        email: p.email,
        website: p.website,
        street: p.address.street,
        city: p.address.city,
        state: p.address.state,
        zip: p.address.zip,
        country: p.address.country,
        linkedin: p.socialLinks.linkedin,
        twitter: p.socialLinks.twitter,
        instagram: p.socialLinks.instagram,
        facebook: p.socialLinks.facebook,
        bio: p.bio,
        hasPets: p.hasPets,
        hasElderlyLovedOnes: p.hasElderlyLovedOnes,
      });
      setInitialized(true);
      const stored = localStorage.getItem(`profileImage_${phone}`);
      if (stored) setImagePreview(stored);
    }
  }, [record, initialized, phone]);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setFormState((prev) => ({ ...prev, [key]: value }));
    if (errors[key])
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    return errs;
  }

  const isLoggedIn = !!identity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      login();
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setActiveSection("personal");
      return;
    }
    if (!actor) {
      toast.error("Not connected. Please wait and try again.");
      return;
    }
    setSubmitting(true);
    try {
      const profile: Profile = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        jobTitle: form.jobTitle.trim(),
        company: form.company.trim(),
        phone,
        email: form.email.trim(),
        website: form.website.trim(),
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          zip: form.zip.trim(),
          country: form.country.trim(),
        },
        socialLinks: {
          linkedin: form.linkedin.trim(),
          twitter: form.twitter.trim(),
          instagram: form.instagram.trim(),
          facebook: form.facebook.trim(),
        },
        bio: form.bio.trim(),
        hasPets: form.hasPets,
        hasElderlyLovedOnes: form.hasElderlyLovedOnes,
      };
      await actor.createOrReplaceProfile(phone, profile);
      toast.success("Your card has been updated!");
      if (imagePreview) {
        localStorage.setItem(`profileImage_${phone}`, imagePreview);
      }
      onNavigate({ type: "view", phone });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen font-sans"
        style={{ background: "oklch(0.975 0.005 240)" }}
      >
        <header
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            background: "oklch(0.175 0.045 240 / 0.95)",
            borderBottom: "1px solid oklch(1 0 0 / 0.07)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center">
            <span className="font-display font-extrabold text-xl leading-none">
              <span className="text-white">TapIt</span>
              <span style={{ color: "oklch(0.68 0.13 185)" }}>ID</span>
            </span>
          </div>
        </header>
        <main
          className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6"
          data-ocid="edit.loading_state"
        >
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "oklch(0.975 0.005 240)" }}
    >
      {/* Nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "oklch(0.175 0.045 240 / 0.95)",
          borderBottom: "1px solid oklch(1 0 0 / 0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate({ type: "view", phone })}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "oklch(0.72 0.025 240)" }}
            data-ocid="nav.link"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Card
          </button>
          <span className="font-display font-extrabold text-xl leading-none">
            <span className="text-white">TapIt</span>
            <span style={{ color: "oklch(0.68 0.13 185)" }}>ID</span>
          </span>
        </div>
      </header>

      <main className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Page heading */}
          <div className="mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 border"
              style={{
                background: "oklch(0.68 0.13 185 / 0.1)",
                borderColor: "oklch(0.68 0.13 185 / 0.2)",
                color: "oklch(0.5 0.1 185)",
              }}
            >
              EDIT CARD
            </div>
            <h1
              className="font-display font-extrabold mb-2"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.03em",
                color: "oklch(0.17 0.04 255)",
              }}
            >
              Update Your Card
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-sm" style={{ color: "oklch(0.52 0.03 240)" }}>
                Phone:
              </p>
              <span
                className="text-sm font-semibold px-3 py-1 rounded-lg"
                style={{
                  background: "oklch(0.9 0.008 240)",
                  color: "oklch(0.35 0.04 255)",
                }}
              >
                {phone}
              </span>
              <span
                className="text-xs"
                style={{ color: "oklch(0.62 0.025 240)" }}
              >
                (cannot be changed)
              </span>
            </div>
          </div>

          {/* Section tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                  style={{
                    background: active ? "oklch(0.55 0.22 260)" : "white",
                    color: active ? "white" : "oklch(0.45 0.04 240)",
                    border: `1px solid ${active ? "oklch(0.55 0.22 260)" : "oklch(0.88 0.01 240)"}`,
                    boxShadow: active
                      ? "0 2px 12px oklch(0.55 0.22 260 / 0.3)"
                      : "none",
                  }}
                  data-ocid={`edit.${s.id}.tab`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit}>
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "white",
                borderColor: "oklch(0.9 0.008 240)",
                boxShadow: "0 4px 24px oklch(0.17 0.04 255 / 0.06)",
              }}
            >
              {/* Personal Info */}
              {activeSection === "personal" && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                  data-ocid="edit.personal.section"
                >
                  <h2
                    className="font-display font-bold text-lg mb-6"
                    style={{ color: "oklch(0.17 0.04 255)" }}
                  >
                    Personal Information
                  </h2>

                  {/* Profile photo upload */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover"
                          style={{
                            border: "3px solid oklch(0.55 0.22 260 / 0.4)",
                          }}
                        />
                      ) : (
                        <div
                          className="w-24 h-24 rounded-full flex items-center justify-center"
                          style={{
                            background: "oklch(0.55 0.22 260 / 0.08)",
                            border: "2px dashed oklch(0.55 0.22 260 / 0.3)",
                          }}
                        >
                          <User
                            className="h-8 w-8"
                            style={{ color: "oklch(0.55 0.22 260 / 0.5)" }}
                          />
                        </div>
                      )}
                      <label
                        htmlFor="editProfileImage"
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                        style={{
                          background: "oklch(0.55 0.22 260)",
                          boxShadow: "0 2px 8px oklch(0.55 0.22 260 / 0.4)",
                        }}
                      >
                        <Camera className="h-4 w-4 text-white" />
                      </label>
                      <input
                        id="editProfileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        data-ocid="edit.profile-image.input"
                      />
                    </div>
                    <p
                      className="text-xs mt-3"
                      style={{ color: "oklch(0.52 0.03 240)" }}
                    >
                      {imagePreview
                        ? "Tap photo to change"
                        : "Add a profile photo"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-firstName"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-firstName"
                        value={form.firstName}
                        onChange={(e) => setField("firstName", e.target.value)}
                        placeholder="Jane"
                        className={errors.firstName ? "border-red-400" : ""}
                        data-ocid="edit.first-name.input"
                      />
                      {errors.firstName && (
                        <p
                          className="text-xs text-red-500"
                          data-ocid="edit.first-name.error_state"
                        >
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-lastName"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-lastName"
                        value={form.lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                        placeholder="Smith"
                        className={errors.lastName ? "border-red-400" : ""}
                        data-ocid="edit.last-name.input"
                      />
                      {errors.lastName && (
                        <p
                          className="text-xs text-red-500"
                          data-ocid="edit.last-name.error_state"
                        >
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-jobTitle"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Job Title
                      </Label>
                      <Input
                        id="edit-jobTitle"
                        value={form.jobTitle}
                        onChange={(e) => setField("jobTitle", e.target.value)}
                        placeholder="Senior Product Designer"
                        data-ocid="edit.job-title.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-company"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Company
                      </Label>
                      <Input
                        id="edit-company"
                        value={form.company}
                        onChange={(e) => setField("company", e.target.value)}
                        placeholder="Acme Inc."
                        data-ocid="edit.company.input"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Contact Details */}
              {activeSection === "contact" && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                  data-ocid="edit.contact.section"
                >
                  <h2
                    className="font-display font-bold text-lg mb-6"
                    style={{ color: "oklch(0.17 0.04 255)" }}
                  >
                    Contact Details
                  </h2>
                  <div
                    className="mb-4 p-3 rounded-xl"
                    style={{
                      background: "oklch(0.95 0.008 240)",
                      border: "1px solid oklch(0.88 0.01 240)",
                    }}
                  >
                    <p
                      className="text-xs font-medium"
                      style={{ color: "oklch(0.45 0.03 240)" }}
                    >
                      Phone (locked): <span className="font-bold">{phone}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-email"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Email Address
                      </Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="jane@example.com"
                        data-ocid="edit.email.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-website"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Website
                      </Label>
                      <Input
                        id="edit-website"
                        type="url"
                        value={form.website}
                        onChange={(e) => setField("website", e.target.value)}
                        placeholder="https://janesmith.com"
                        data-ocid="edit.website.input"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Address */}
              {activeSection === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                  data-ocid="edit.address.section"
                >
                  <h2
                    className="font-display font-bold text-lg mb-6"
                    style={{ color: "oklch(0.17 0.04 255)" }}
                  >
                    Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2 sm:col-span-2">
                      <Label
                        htmlFor="edit-street"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Street Address
                      </Label>
                      <Input
                        id="edit-street"
                        value={form.street}
                        onChange={(e) => setField("street", e.target.value)}
                        placeholder="123 Main Street"
                        data-ocid="edit.street.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-city"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        City
                      </Label>
                      <Input
                        id="edit-city"
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder="New York"
                        data-ocid="edit.city.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-state"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        State / Province
                      </Label>
                      <Input
                        id="edit-state"
                        value={form.state}
                        onChange={(e) => setField("state", e.target.value)}
                        placeholder="NY"
                        data-ocid="edit.state.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-zip"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        ZIP / Postal Code
                      </Label>
                      <Input
                        id="edit-zip"
                        value={form.zip}
                        onChange={(e) => setField("zip", e.target.value)}
                        placeholder="10001"
                        data-ocid="edit.zip.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-country"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Country
                      </Label>
                      <Input
                        id="edit-country"
                        value={form.country}
                        onChange={(e) => setField("country", e.target.value)}
                        placeholder="United States"
                        data-ocid="edit.country.input"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Social Links */}
              {activeSection === "social" && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                  data-ocid="edit.social.section"
                >
                  <h2
                    className="font-display font-bold text-lg mb-6"
                    style={{ color: "oklch(0.17 0.04 255)" }}
                  >
                    Social Links
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-linkedin"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        LinkedIn
                      </Label>
                      <Input
                        id="edit-linkedin"
                        value={form.linkedin}
                        onChange={(e) => setField("linkedin", e.target.value)}
                        placeholder="https://linkedin.com/in/janesmith"
                        data-ocid="edit.linkedin.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-twitter"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Twitter / X
                      </Label>
                      <Input
                        id="edit-twitter"
                        value={form.twitter}
                        onChange={(e) => setField("twitter", e.target.value)}
                        placeholder="https://x.com/janesmith"
                        data-ocid="edit.twitter.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-instagram"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Instagram
                      </Label>
                      <Input
                        id="edit-instagram"
                        value={form.instagram}
                        onChange={(e) => setField("instagram", e.target.value)}
                        placeholder="https://instagram.com/janesmith"
                        data-ocid="edit.instagram.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-facebook"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Facebook
                      </Label>
                      <Input
                        id="edit-facebook"
                        value={form.facebook}
                        onChange={(e) => setField("facebook", e.target.value)}
                        placeholder="https://facebook.com/janesmith"
                        data-ocid="edit.facebook.input"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* About */}
              {activeSection === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                  data-ocid="edit.about.section"
                >
                  <h2
                    className="font-display font-bold text-lg mb-6"
                    style={{ color: "oklch(0.17 0.04 255)" }}
                  >
                    About You
                  </h2>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-bio"
                      style={{ color: "oklch(0.35 0.04 255)" }}
                    >
                      Bio / Notes
                    </Label>
                    <Textarea
                      id="edit-bio"
                      value={form.bio}
                      onChange={(e) => setField("bio", e.target.value)}
                      placeholder="Tell people a bit about yourself..."
                      rows={6}
                      className="resize-none"
                      data-ocid="edit.bio.textarea"
                    />
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.58 0.03 240)" }}
                    >
                      {form.bio.length} / 500 characters
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Upsell */}
              {activeSection === "upsell" && (
                <motion.div
                  key="upsell"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                  data-ocid="edit.upsell.section"
                >
                  <h2
                    className="font-display font-bold text-lg mb-2"
                    style={{ color: "oklch(0.17 0.04 255)" }}
                  >
                    Optional Services
                  </h2>
                  <p
                    className="text-sm mb-8"
                    style={{ color: "oklch(0.52 0.03 240)" }}
                  >
                    Update your service preferences anytime.
                  </p>
                  <div className="space-y-6">
                    <div
                      className="flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all"
                      style={{
                        background: form.hasPets
                          ? "oklch(0.68 0.13 185 / 0.06)"
                          : "oklch(0.975 0.005 240)",
                        borderColor: form.hasPets
                          ? "oklch(0.68 0.13 185 / 0.4)"
                          : "oklch(0.9 0.008 240)",
                      }}
                      onClick={() => setField("hasPets", !form.hasPets)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setField("hasPets", !form.hasPets);
                      }}
                    >
                      <Checkbox
                        id="edit-hasPets"
                        checked={form.hasPets}
                        onCheckedChange={(checked) =>
                          setField("hasPets", !!checked)
                        }
                        className="mt-0.5"
                        data-ocid="edit.pets.checkbox"
                      />
                      <div>
                        <label
                          htmlFor="edit-hasPets"
                          className="font-semibold text-sm cursor-pointer"
                          style={{ color: "oklch(0.17 0.04 255)" }}
                        >
                          I have pets 🐾
                        </label>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "oklch(0.52 0.03 240)" }}
                        >
                          We can send you information about our pet ID tags.
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all"
                      style={{
                        background: form.hasElderlyLovedOnes
                          ? "oklch(0.55 0.22 260 / 0.06)"
                          : "oklch(0.975 0.005 240)",
                        borderColor: form.hasElderlyLovedOnes
                          ? "oklch(0.55 0.22 260 / 0.4)"
                          : "oklch(0.9 0.008 240)",
                      }}
                      onClick={() =>
                        setField(
                          "hasElderlyLovedOnes",
                          !form.hasElderlyLovedOnes,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setField(
                            "hasElderlyLovedOnes",
                            !form.hasElderlyLovedOnes,
                          );
                      }}
                    >
                      <Checkbox
                        id="edit-hasElderlyLovedOnes"
                        checked={form.hasElderlyLovedOnes}
                        onCheckedChange={(checked) =>
                          setField("hasElderlyLovedOnes", !!checked)
                        }
                        className="mt-0.5"
                        data-ocid="edit.elderly.checkbox"
                      />
                      <div>
                        <label
                          htmlFor="edit-hasElderlyLovedOnes"
                          className="font-semibold text-sm cursor-pointer"
                          style={{ color: "oklch(0.17 0.04 255)" }}
                        >
                          I have elderly loved ones 👴👵
                        </label>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "oklch(0.52 0.03 240)" }}
                        >
                          We can send you information about senior care ID tags.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <Separator />

              {/* Footer actions */}
              <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-2 order-2 sm:order-1">
                  {sections.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSection(s.id)}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{
                        background:
                          activeSection === s.id
                            ? "oklch(0.55 0.22 260)"
                            : "oklch(0.88 0.01 240)",
                      }}
                      aria-label={`Go to ${s.label}`}
                      data-ocid={`edit.step-dot-${idx + 1}.toggle`}
                    />
                  ))}
                </div>
                <div className="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
                  {activeSection !== sections[0].id && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const idx = sections.findIndex(
                          (s) => s.id === activeSection,
                        );
                        if (idx > 0) setActiveSection(sections[idx - 1].id);
                      }}
                      className="flex-1 sm:flex-none"
                      data-ocid="edit.prev.secondary_button"
                    >
                      Back
                    </Button>
                  )}
                  {activeSection !== sections[sections.length - 1].id ? (
                    <Button
                      type="button"
                      onClick={() => {
                        const idx = sections.findIndex(
                          (s) => s.id === activeSection,
                        );
                        setActiveSection(sections[idx + 1].id);
                      }}
                      className="flex-1 sm:flex-none text-white font-semibold"
                      style={{ background: "oklch(0.55 0.22 260)" }}
                      data-ocid="edit.next.primary_button"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 sm:flex-none text-white font-semibold"
                      style={{ background: "oklch(0.68 0.13 185)" }}
                      data-ocid="edit.submit.save_button"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {submitting
                        ? "Saving..."
                        : isLoggedIn
                          ? "Save Changes"
                          : "Sign In & Save"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="py-8 text-center"
        style={{ borderTop: "1px solid oklch(0.9 0.008 240)" }}
      >
        <p className="text-xs" style={{ color: "oklch(0.55 0.022 240)" }}>
          © {new Date().getFullYear()} TapIt ID. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="underline-offset-2 hover:underline"
            style={{ color: "oklch(0.52 0.1 185)" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
