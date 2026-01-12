"use client";

import { useState } from "react";
import { Upload, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
}

const platformOptions: { value: Platform; label: string }[] = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "discord", label: "Discord" },
  { value: "telegram", label: "Telegram" },
  { value: "other", label: "Other" },
];

export default function CreateEventPage() {
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
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement event creation logic
    console.log("Event created:", formData);
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
                        required
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
                        required
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
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Create Event
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
              <div
                className={`relative aspect-square rounded-2xl bg-gradient-to-br ${formData.bannerColor} flex items-center justify-center overflow-hidden shadow-lg`}
              >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 opacity-30 mix-blend-overlay" />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <p className="text-white text-lg font-semibold">
                    Event Banner
                  </p>
                </div>

                {/* Edit Button */}
                <button className="absolute bottom-4 right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm z-20">
                  <Upload className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Banner Info */}
              <p className="text-xs text-muted-foreground mt-3">
                Recommended size: 1200x600px
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
