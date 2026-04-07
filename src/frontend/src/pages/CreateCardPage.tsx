import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
import { useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type PageNav = { type: "home" } | { type: "view"; phone: string };

interface CreateCardPageProps {
  onNavigate: (page: PageNav) => void;
  successMessage?: string;
}

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  company: "",
  phone: "",
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
};

const sections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "contact", label: "Contact Details", icon: Phone },
  { id: "address", label: "Address", icon: MapPin },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "about", label: "About", icon: Briefcase },
  { id: "upsell", label: "Optional Services", icon: Heart },
];

export function CreateCardPage({ onNavigate }: CreateCardPageProps) {
  const { actor } = useActor();
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [activeSection, setActiveSection] = useState("personal");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isLoggedIn = !!identity;

  function setField<K extends keyof typeof EMPTY_FORM>(
    key: K,
    value: (typeof EMPTY_FORM)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key])
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
  }

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

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[+\d][\d\s\-().]{6,}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid phone number";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      login();
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErr = Object.keys(errs)[0];
      const sectionMap: Record<string, string> = {
        firstName: "personal",
        lastName: "personal",
        phone: "contact",
        email: "contact",
        website: "contact",
      };
      setActiveSection(sectionMap[firstErr] || "personal");
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
        phone: form.phone.trim(),
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
      await actor.createOrReplaceProfile(profile.phone, profile);
      toast.success("Your card has been created!");
      if (imagePreview) {
        localStorage.setItem(`profileImage_${profile.phone}`, imagePreview);
      }
      onNavigate({ type: "view", phone: profile.phone });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            onClick={() => onNavigate({ type: "home" })}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "oklch(0.72 0.025 240)" }}
            data-ocid="nav.link"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
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
                background: "oklch(0.55 0.22 260 / 0.1)",
                borderColor: "oklch(0.55 0.22 260 / 0.2)",
                color: "oklch(0.55 0.22 260)",
              }}
            >
              NEW CARD
            </div>
            <h1
              className="font-display font-extrabold mb-2"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.03em",
                color: "oklch(0.17 0.04 255)",
              }}
            >
              Create Your Digital Card
            </h1>
            <p className="text-sm" style={{ color: "oklch(0.52 0.03 240)" }}>
              Fill in your details below. Your phone number is your unique
              identifier.
            </p>
          </div>

          {/* Login gate */}
          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{
                background: "oklch(0.55 0.22 260 / 0.06)",
                borderColor: "oklch(0.55 0.22 260 / 0.2)",
              }}
              data-ocid="create.login-prompt.card"
            >
              <div className="flex-1">
                <p
                  className="font-semibold text-sm mb-1"
                  style={{ color: "oklch(0.17 0.04 255)" }}
                >
                  Sign in to save your card
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.52 0.03 240)" }}
                >
                  You can fill out the form now, but you'll need to log in
                  before saving.
                </p>
              </div>
              <Button
                type="button"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                className="shrink-0 text-white font-semibold"
                style={{ background: "oklch(0.55 0.22 260)" }}
                data-ocid="create.login.primary_button"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </motion.div>
          )}

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
                  data-ocid={`create.${s.id}.tab`}
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
                  data-ocid="create.personal.section"
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
                        htmlFor="profileImage"
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                        style={{
                          background: "oklch(0.55 0.22 260)",
                          boxShadow: "0 2px 8px oklch(0.55 0.22 260 / 0.4)",
                        }}
                      >
                        <Camera className="h-4 w-4 text-white" />
                      </label>
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        data-ocid="create.profile-image.input"
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
                        htmlFor="firstName"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => setField("firstName", e.target.value)}
                        placeholder="Jane"
                        className={errors.firstName ? "border-red-400" : ""}
                        data-ocid="create.first-name.input"
                      />
                      {errors.firstName && (
                        <p
                          className="text-xs text-red-500"
                          data-ocid="create.first-name.error_state"
                        >
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                        placeholder="Smith"
                        className={errors.lastName ? "border-red-400" : ""}
                        data-ocid="create.last-name.input"
                      />
                      {errors.lastName && (
                        <p
                          className="text-xs text-red-500"
                          data-ocid="create.last-name.error_state"
                        >
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="jobTitle"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        value={form.jobTitle}
                        onChange={(e) => setField("jobTitle", e.target.value)}
                        placeholder="Senior Product Designer"
                        data-ocid="create.job-title.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={form.company}
                        onChange={(e) => setField("company", e.target.value)}
                        placeholder="Acme Inc."
                        data-ocid="create.company.input"
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
                  data-ocid="create.contact.section"
                >
                  <h2
                    className="font-display font-bold text-lg mb-6"
                    style={{ color: "oklch(0.17 0.04 255)" }}
                  >
                    Contact Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2 sm:col-span-2">
                      <Label
                        htmlFor="phone"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.58 0.03 240)" }}
                      >
                        This is your unique identifier. Include country code,
                        e.g. +1 555 000 0000
                      </p>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        placeholder="+1 555 000 0000"
                        className={errors.phone ? "border-red-400" : ""}
                        data-ocid="create.phone.input"
                      />
                      {errors.phone && (
                        <p
                          className="text-xs text-red-500"
                          data-ocid="create.phone.error_state"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="jane@example.com"
                        data-ocid="create.email.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Website
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={form.website}
                        onChange={(e) => setField("website", e.target.value)}
                        placeholder="https://janesmith.com"
                        data-ocid="create.website.input"
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
                  data-ocid="create.address.section"
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
                        htmlFor="street"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Street Address
                      </Label>
                      <Input
                        id="street"
                        value={form.street}
                        onChange={(e) => setField("street", e.target.value)}
                        placeholder="123 Main Street"
                        data-ocid="create.street.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        City
                      </Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder="New York"
                        data-ocid="create.city.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        State / Province
                      </Label>
                      <Input
                        id="state"
                        value={form.state}
                        onChange={(e) => setField("state", e.target.value)}
                        placeholder="NY"
                        data-ocid="create.state.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="zip"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        ZIP / Postal Code
                      </Label>
                      <Input
                        id="zip"
                        value={form.zip}
                        onChange={(e) => setField("zip", e.target.value)}
                        placeholder="10001"
                        data-ocid="create.zip.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={form.country}
                        onChange={(e) => setField("country", e.target.value)}
                        placeholder="United States"
                        data-ocid="create.country.input"
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
                  data-ocid="create.social.section"
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
                        htmlFor="linkedin"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        value={form.linkedin}
                        onChange={(e) => setField("linkedin", e.target.value)}
                        placeholder="https://linkedin.com/in/janesmith"
                        data-ocid="create.linkedin.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="twitter"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Twitter / X
                      </Label>
                      <Input
                        id="twitter"
                        value={form.twitter}
                        onChange={(e) => setField("twitter", e.target.value)}
                        placeholder="https://x.com/janesmith"
                        data-ocid="create.twitter.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="instagram"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={form.instagram}
                        onChange={(e) => setField("instagram", e.target.value)}
                        placeholder="https://instagram.com/janesmith"
                        data-ocid="create.instagram.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="facebook"
                        style={{ color: "oklch(0.35 0.04 255)" }}
                      >
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        value={form.facebook}
                        onChange={(e) => setField("facebook", e.target.value)}
                        placeholder="https://facebook.com/janesmith"
                        data-ocid="create.facebook.input"
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
                  data-ocid="create.about.section"
                >
                  <h2
                    className="font-display font-bold text-lg mb-6"
                    style={{ color: "oklch(0.17 0.04 255)" }}
                  >
                    About You
                  </h2>
                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      style={{ color: "oklch(0.35 0.04 255)" }}
                    >
                      Bio / Notes
                    </Label>
                    <Textarea
                      id="bio"
                      value={form.bio}
                      onChange={(e) => setField("bio", e.target.value)}
                      placeholder="Tell people a bit about yourself, your expertise, or what you do..."
                      rows={6}
                      className="resize-none"
                      data-ocid="create.bio.textarea"
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
                  data-ocid="create.upsell.section"
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
                    Help us help you. Select any that apply and we'll reach out
                    with relevant offers.
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
                        id="hasPets"
                        checked={form.hasPets}
                        onCheckedChange={(checked) =>
                          setField("hasPets", !!checked)
                        }
                        className="mt-0.5"
                        data-ocid="create.pets.checkbox"
                      />
                      <div>
                        <label
                          htmlFor="hasPets"
                          className="font-semibold text-sm cursor-pointer"
                          style={{ color: "oklch(0.17 0.04 255)" }}
                        >
                          I have pets 🐾
                        </label>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "oklch(0.52 0.03 240)" }}
                        >
                          We can send you information about our pet ID tags —
                          perfect for keeping your furry friends safe and
                          identifiable.
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
                        id="hasElderlyLovedOnes"
                        checked={form.hasElderlyLovedOnes}
                        onCheckedChange={(checked) =>
                          setField("hasElderlyLovedOnes", !!checked)
                        }
                        className="mt-0.5"
                        data-ocid="create.elderly.checkbox"
                      />
                      <div>
                        <label
                          htmlFor="hasElderlyLovedOnes"
                          className="font-semibold text-sm cursor-pointer"
                          style={{ color: "oklch(0.17 0.04 255)" }}
                        >
                          I have elderly loved ones 👴👵
                        </label>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "oklch(0.52 0.03 240)" }}
                        >
                          We can send you information about senior care ID tags
                          — helping keep your loved ones safe and giving you
                          peace of mind.
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
                      data-ocid={`create.step-dot-${idx + 1}.toggle`}
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
                      data-ocid="create.prev.secondary_button"
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
                      data-ocid="create.next.primary_button"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 sm:flex-none text-white font-semibold"
                      style={{ background: "oklch(0.55 0.22 260)" }}
                      data-ocid="create.submit.primary_button"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {submitting
                        ? "Saving..."
                        : isLoggedIn
                          ? "Create My Card"
                          : "Sign In & Create"}
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
