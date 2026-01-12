import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
      <p className="text-muted-foreground mb-8">
        Create an event and issue badges to attendees on the Stacks blockchain
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Provide information about your event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name *</Label>
              <Input
                id="eventName"
                type="text"
                placeholder="e.g., Web3 Conference 2026"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your event..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date *</Label>
                <Input id="date" type="datetime-local" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, Country or Virtual"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttendees">Max Attendees</Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="Leave empty for unlimited"
                min="1"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Badge Configuration
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="badgeName">Badge Name *</Label>
                  <Input
                    id="badgeName"
                    type="text"
                    placeholder="e.g., Web3 Attendee 2026"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badgeImage">Badge Image URL</Label>
                  <Input
                    id="badgeImage"
                    type="url"
                    placeholder="https://example.com/badge.png"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload your badge artwork and provide the URL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badgeDescription">Badge Description</Label>
                  <Textarea
                    id="badgeDescription"
                    placeholder="Describe what this badge represents..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> Creating an event will deploy a smart
                contract on the Stacks blockchain. Make sure your wallet is
                connected and has sufficient STX for transaction fees.
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
