"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  ExternalLink,
  Copy,
  Download,
  Edit,
  Pause,
  Play,
  Share2,
  QrCode,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ManageEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ManageEventPage({ params }: ManageEventPageProps) {
  const [eventId, setEventId] = useState<string>("");
  const [isClaimWindowOpen, setIsClaimWindowOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    params.then((p) => setEventId(p.id));
  }, [params]);

  const handleToggleClaimWindow = () => {
    setIsClaimWindowOpen(!isClaimWindowOpen);
    // TODO: Implement actual claim window toggle logic
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportAttendees = () => {
    // TODO: Implement export functionality
    const data = [
      {
        address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        claimedAt: "2025-11-30T18:23:12Z",
      },
      { address: "SP3FBR2AG8DVTEC6E", claimedAt: "2025-11-30T19:45:33Z" },
    ];
    const csv =
      "Address,Claimed At\n" +
      data.map((d) => `${d.address},${d.claimedAt}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event-${eventId}-attendees.csv`;
    a.click();
  };

  // Mock data
  const stats = {
    totalClaims: 45,
    totalSupply: 100,
    uniqueVisitors: 234,
    claimRate: 45,
  };

  const recentClaims = [
    {
      address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
      time: "2 minutes ago",
      txId: "0xabc123...",
    },
    {
      address: "SP3FBR2AGXYZ8DVTEC6E",
      time: "15 minutes ago",
      txId: "0xdef456...",
    },
    { address: "SP1HJQR4K2YWPJV7M", time: "1 hour ago", txId: "0xghi789..." },
    { address: "SP4MNBXY3KLPQRS9T", time: "2 hours ago", txId: "0xjkl012..." },
    { address: "SP5OPQRZ4TUVWXY1A", time: "3 hours ago", txId: "0xmno345..." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/events"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Event</h1>
              <p className="text-muted-foreground">
                Stacks DeFi Show #80 • Event ID: {eventId}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" asChild>
                <Link href={`/events/${eventId}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Public Page
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={`/events/${eventId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Claim Window Status Alert */}
        {isClaimWindowOpen ? (
          <Alert className="mb-6 border-green-500 bg-green-500/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <AlertTitle className="text-green-500 mb-0">
                Event is Live
              </AlertTitle>
            </div>
            <AlertDescription className="text-green-600 dark:text-green-400 mt-2">
              Claim window is currently open. Users can claim their badges now.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Claim Window Closed</AlertTitle>
            <AlertDescription>
              The claim window is currently closed. Users cannot claim badges at
              this time.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalClaims}</div>
              <p className="text-xs text-muted-foreground mt-1">
                of {stats.totalSupply} total supply
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Claim Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.claimRate}%</div>
              <Progress value={stats.claimRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unique Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.uniqueVisitors}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <p className="text-xs text-green-500">+12% from last hour</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.totalSupply - stats.totalClaims}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                badges available
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Claim Window Control */}
            <Card>
              <CardHeader>
                <CardTitle>Claim Window Control</CardTitle>
                <CardDescription>
                  Manage when users can claim their badges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Claim Window Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {isClaimWindowOpen
                        ? "Currently accepting badge claims"
                        : "Claims are paused"}
                    </p>
                  </div>
                  <Button
                    onClick={handleToggleClaimWindow}
                    variant={isClaimWindowOpen ? "destructive" : "default"}
                  >
                    {isClaimWindowOpen ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Close Window
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Open Window
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Opens At
                    </h4>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Nov 30, 6:00 PM UTC</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Closes At
                    </h4>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Nov 30, 7:20 PM UTC</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Claims */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Claims</CardTitle>
                    <CardDescription>
                      Latest badge claims from attendees
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportAttendees}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentClaims.map((claim, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-mono text-sm font-medium">
                          {claim.address.slice(0, 10)}...
                          {claim.address.slice(-6)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {claim.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {claim.txId}
                        </Badge>
                        <Button size="sm" variant="ghost" asChild>
                          <a
                            href={`https://explorer.stacks.co/txid/${claim.txId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Current event configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Event Title
                    </h4>
                    <p className="text-sm font-medium">Stacks DeFi Show #80</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Event Date
                    </h4>
                    <p className="text-sm font-medium">Nov 30, 2025</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Host
                    </h4>
                    <p className="text-sm font-medium">Stacks Foundation</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Platform
                    </h4>
                    <p className="text-sm font-medium">Twitter Spaces</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Join our weekly deep dive into Stacks DeFi ecosystem. This
                    week we&apos;re covering Bitcoin L2 developments, recent
                    protocol upgrades, and the latest trends in decentralized
                    finance on Stacks.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCopyLink}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "Copied!" : "Copy Claim Link"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const link = `${window.location.origin}/events/${eventId}`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
                    const a = document.createElement("a");
                    a.href = qrUrl;
                    a.download = `event-${eventId}-qr.png`;
                    a.click();
                  }}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const link = `${window.location.origin}/events/${eventId}`;
                    const text = `Check out this event: ${link}`;
                    if (navigator.share) {
                      navigator.share({
                        title: "Stacks DeFi Show #80",
                        text: text,
                        url: link,
                      });
                    } else {
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share on Social
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = "/api/badges/download";
                    a.download = `event-${eventId}-badge.png`;
                    a.click();
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Badge
                </Button>
              </CardContent>
            </Card>

            {/* Analytics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Analytics Summary</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Page Views
                  </span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Unique Visitors
                  </span>
                  <span className="text-sm font-medium">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Claim Attempts
                  </span>
                  <span className="text-sm font-medium">52</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Success Rate
                  </span>
                  <span className="text-sm font-medium text-green-500">
                    86.5%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Badge Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Badge Preview</CardTitle>
                <CardDescription>NFT design</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-center text-white p-4">
                    <div className="text-4xl mb-2">🎙️</div>
                    <div className="text-sm font-bold">
                      Stacks DeFi Show #80
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contract Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Network
                  </h4>
                  <p className="text-sm font-medium">Stacks Mainnet</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Contract
                  </h4>
                  <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                    SP2J6ZY48...event-{eventId}
                  </code>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href={`https://explorer.stacks.co/txid/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.event-${eventId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    View on Explorer
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
