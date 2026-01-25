"use client";

import { useState, useRef } from "react";
import { Upload, Clock, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Platform = "twitter" | "discord" | "telegram" | "other";

interface EventFormState {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  claimOpens: string;
  claimCloses: string;
  hostName: string;
  platform: Platform;
  eventLink: string;
  bannerColor: string;
  bannerUrl?: string;
}

const platformOptions: { value: Platform; label: string }[] = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "discord", label: "Discord" },
  { value: "telegram", label: "Telegram" },
  { value: "other", label: "Other" },
];

export default function CreateEventPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<EventFormState>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    claimOpens: "",
    claimCloses: "",
    hostName: "",
    platform: "twitter",
    eventLink: "",
    bannerColor: "from-blue-600 to-purple-600",
    bannerUrl: undefined,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      claimOpens: "",
      claimCloses: "",
      hostName: "",
      platform: "twitter",
      eventLink: "",
      bannerColor: "from-blue-600 to-purple-600",
      bannerUrl: undefined,
    });
    setUploadProgress(0);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      setUploadProgress(30);

      const response = await fetch("/api/events/banner", {
        method: "POST",
        body: formDataToSend,
      });

      setUploadProgress(70);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload banner");
      }

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        bannerUrl: data.url,
      }));

      setUploadProgress(100);
      toast.success("Banner uploaded successfully!");

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload banner",
      );
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleBannerClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setUploading(true);

      // Convert date and time to Unix timestamps
      const eventDate = new Date(`${formData.date}T${formData.startTime}`);
      const eventEndDate = new Date(`${formData.date}T${formData.endTime}`);
      const startTime = Math.floor(eventDate.getTime() / 1000);
      const endTime = Math.floor(eventEndDate.getTime() / 1000);

      // Validate times
      if (startTime >= endTime) {
        toast.error("Start time must be before end time");
        setUploading(false);
        return;
      }

      // Import the contract call function
      const { createEvent } = await import("@/lib/contract-calls");

      // Create event on-chain
      await createEvent({
        name: formData.title,
        description: formData.description,
        imageUri: formData.bannerUrl || "ipfs://default",
        startTime,
        endTime,
        maxAttendees: 1000, // Default max attendees
        onFinish: async (data) => {
          try {
            // Get wallet address from Stacks connect
            const { getLocalStorage } = await import("@stacks/connect");
            const stacksData = getLocalStorage();
            const walletAddress = stacksData?.addresses?.stx?.[0]?.address;

            if (walletAddress) {
              // Build claim window dates if provided
              let claimOpensAt = null;
              let claimClosesAt = null;

              if (formData.claimOpens) {
                claimOpensAt = new Date(
                  `${formData.date}T${formData.claimOpens}`,
                ).toISOString();
              }

              if (formData.claimCloses) {
                claimClosesAt = new Date(
                  `${formData.date}T${formData.claimCloses}`,
                ).toISOString();
              }

              const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: formData.title,
                  description: formData.description,
                  startTime: new Date(
                    `${formData.date}T${formData.startTime}`,
                  ).toISOString(),
                  endTime: new Date(
                    `${formData.date}T${formData.endTime}`,
                  ).toISOString(),
                  claimOpensAt,
                  claimClosesAt,
                  bannerUrl: formData.bannerUrl || null,
                  maxAttendees: 1000,
                  walletAddress,
                  txId: data.txId,
                }),
              });

              if (!response.ok) {
                console.error("Failed to save event to database");
              }
            }
          } catch (dbError) {
            console.error("Failed to save event to database:", dbError);
            // Don't block the success flow if DB save fails
          }

          setUploading(false);
          toast.success(
            "Event created successfully! It will appear in the events list shortly.",
          );

          // Reset form
          setFormData({
            title: "",
            description: "",
            date: "",
            startTime: "",
            endTime: "",
            claimOpens: "",
            claimCloses: "",
            hostName: "",
            platform: "twitter",
            eventLink: "",
            bannerColor: "from-blue-600 to-purple-600",
            bannerUrl: undefined,
          });
        },
        onCancel: () => {
          setUploading(false);
          toast.error("Transaction cancelled by user");
        },
      });
    } catch (error) {
      setUploading(false);
      console.error("Error creating event:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create event",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Create New Event
          </h1>
          <p className="text-muted-foreground">
            Set up an event and auto-generate a claimable attendance badge
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCreateEvent} className="space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Event Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Stacks Deft Show #80"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-input/50 border-input"
                  required
                />
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Short Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Join our weekly breakdown of Bitcoin L2 updates and DeFi insights."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-input/50 border-input resize-none"
                  required
                />
              </div>

              {/* Event Date & Time */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Event Date & Time
                </Label>

                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="bg-input/50 border-input"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="startTime"
                      className="text-xs text-muted-foreground mb-2 block"
                    >
                      Start Time:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        placeholder="6:00 PM UTC"
                        className="bg-input/50 border-input text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="endTime"
                      className="text-xs text-muted-foreground mb-2 block"
                    >
                      End Time:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        placeholder="7:00 PM UTC"
                        className="bg-input/50 border-input text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Claim Window */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Claim Window</Label>
                <p className="text-xs text-muted-foreground">
                  Optional: Set specific times when attendees can claim badges
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="claimOpens"
                      className="text-xs text-muted-foreground mb-2 block"
                    >
                      Claim Opens:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        id="claimOpens"
                        name="claimOpens"
                        type="time"
                        value={formData.claimOpens}
                        onChange={handleInputChange}
                        placeholder="6:00 PM UTC"
                        className="bg-input/50 border-input text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="claimCloses"
                      className="text-xs text-muted-foreground mb-2 block"
                    >
                      Claim Closes:
                    </Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        id="claimCloses"
                        name="claimCloses"
                        type="time"
                        value={formData.claimCloses}
                        onChange={handleInputChange}
                        placeholder="7:00 PM UTC"
                        className="bg-input/50 border-input text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Name */}
              <div className="space-y-2">
                <Label htmlFor="hostName" className="text-sm font-semibold">
                  Host Name
                </Label>
                <Input
                  id="hostName"
                  name="hostName"
                  type="text"
                  placeholder="Stacks Foundation"
                  value={formData.hostName}
                  onChange={handleInputChange}
                  className="bg-input/50 border-input"
                  required
                />
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-sm font-semibold">
                  Platform
                </Label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-input bg-input/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  {platformOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Link */}
              <div className="space-y-2">
                <Label htmlFor="eventLink" className="text-sm font-semibold">
                  Event Link
                </Label>
                <Input
                  id="eventLink"
                  name="eventLink"
                  type="url"
                  placeholder="https://x.com/spaces/abc123"
                  value={formData.eventLink}
                  onChange={handleInputChange}
                  className="bg-input/50 border-input"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Banner Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Label className="text-sm font-semibold block mb-3">
                Event Banner
              </Label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleBannerUpload}
                className="hidden"
              />

              <div className="w-full" style={{ aspectRatio: "1 / 1" }}>
                <div
                  className={`relative w-full h-full rounded-2xl ${
                    formData.bannerUrl
                      ? "bg-cover bg-center"
                      : `bg-gradient-to-br ${formData.bannerColor}`
                  } flex items-center justify-center overflow-hidden shadow-lg cursor-pointer group transition-opacity hover:opacity-90`}
                  style={
                    formData.bannerUrl
                      ? { backgroundImage: `url(${formData.bannerUrl})` }
                      : undefined
                  }
                  onClick={handleBannerClick}
                >
                  {/* Decorative gradient overlay */}
                  {!formData.bannerUrl && (
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay" />
                  )}

                  {/* Content */}
                  {!formData.bannerUrl && (
                    <div className="relative z-10 text-center">
                      <p className="text-white text-lg font-semibold">
                        Event Banner
                      </p>
                    </div>
                  )}

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleBannerClick();
                    }}
                    className="absolute bottom-4 right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm z-20"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    ) : formData.bannerUrl ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Upload className="h-5 w-5 text-white" />
                    )}
                  </button>

                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
                      <div className="text-center">
                        <p className="text-white text-sm font-medium mb-2">
                          {uploadProgress}%
                        </p>
                        <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Info */}
              <p className="text-xs text-muted-foreground mt-3">
                Recommended size: 600x600px (Max 10MB)
              </p>
              {formData.bannerUrl && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Banner uploaded
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
