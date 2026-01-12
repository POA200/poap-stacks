import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Event Title</h1>
              <p className="text-muted-foreground">Event ID: {id}</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Upcoming
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    This is a placeholder for the event description. It will
                    contain detailed information about the event, what attendees
                    can expect, and any special requirements or instructions.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Date & Time
                    </h4>
                    <p className="font-medium">Jan 15, 2026 at 10:00 AM</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Location
                    </h4>
                    <p className="font-medium">San Francisco, CA</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Organizer
                    </h4>
                    <p className="font-medium">
                      SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Capacity
                    </h4>
                    <p className="font-medium">45 / 100 claimed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badge Preview</CardTitle>
                <CardDescription>
                  This badge will be minted for attendees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Badge Image</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold">
                      Event Attendee Badge
                    </h3>
                    <p className="text-muted-foreground">
                      A unique NFT badge that proves your attendance at this
                      event. This badge is stored on the Stacks blockchain and
                      can be viewed in your profile.
                    </p>
                    <div className="pt-2">
                      <Badge>NFT</Badge>
                      <Badge variant="outline" className="ml-2">
                        Limited Edition
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="font-mono text-sm">
                      SP2J6ZY48...KNRV9EJ7
                    </span>
                    <span className="text-sm text-muted-foreground">
                      2 hours ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="font-mono text-sm">
                      SP3FBR2AG...8DVTEC6E
                    </span>
                    <span className="text-sm text-muted-foreground">
                      5 hours ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-mono text-sm">
                      SP1HJQR4K...2YWPJV7M
                    </span>
                    <span className="text-sm text-muted-foreground">
                      1 day ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Claim Badge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to claim your attendance badge for this
                  event.
                </p>
                <Button className="w-full" size="lg">
                  Claim Badge
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Requires wallet connection
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Contract Address
                  </h4>
                  <p className="text-sm font-mono break-all">
                    SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.event-{id}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Network
                  </h4>
                  <p className="text-sm">Stacks Mainnet</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View on Explorer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  Copy Link
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1">
                    <span className="sr-only">Twitter</span>
                    𝕏
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <span className="sr-only">Facebook</span>f
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1">
                    <span className="sr-only">LinkedIn</span>
                    in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
