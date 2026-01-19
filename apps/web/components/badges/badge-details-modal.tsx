import { X, ExternalLink, Download, Share2, Copy, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BadgeDetailsModalProps {
  badge: {
    id: string;
    tokenId: string | null;
    claimedAt: string;
    sequenceNumber: number;
    rarity: string;
    event: {
      id: string;
      title: string;
      description: string | null;
      location: string | null;
      startTime: string;
      endTime: string;
      bannerUrl: string | null;
    };
  };
  userAddress: string;
  onClose: () => void;
}

const rarityColors: { [key: string]: string } = {
  legendary: "from-yellow-500 to-yellow-600",
  epic: "from-purple-500 to-purple-600",
  rare: "from-blue-500 to-blue-600",
  common: "from-gray-500 to-gray-600",
};

const rarityDescriptions: { [key: string]: string } = {
  legendary: "Legendary - Only the most dedicated collectors have this!",
  epic: "Epic - A highly valuable achievement",
  rare: "Rare - A special badge to own",
  common: "Common - A wonderful first badge",
};

export default function BadgeDetailsModal({
  badge,
  userAddress,
  onClose,
}: BadgeDetailsModalProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShare = () => {
    const text = `I just claimed the "${badge.event.title}" POAP badge! 🏅`;
    const url = `${window.location.origin}/profile/${userAddress}#badge-${badge.id}`;

    if (navigator.share) {
      navigator.share({
        title: "POAP Badge",
        text,
        url,
      });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success("Badge link copied to clipboard!");
    }
  };

  const handleCopyToken = () => {
    if (badge.tokenId) {
      navigator.clipboard.writeText(badge.tokenId);
      toast.success("Token ID copied!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-primary/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10 sticky top-0 bg-background">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Badge Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Banner */}
          {badge.event.bannerUrl && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={badge.event.bannerUrl}
                alt={badge.event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Rarity */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {badge.event.title}
                </h3>
                {badge.event.description && (
                  <p className="text-muted-foreground">
                    {badge.event.description}
                  </p>
                )}
              </div>
            </div>

            {/* Rarity Badge */}
            <div
              className={`bg-gradient-to-r ${rarityColors[badge.rarity]} p-4 rounded-lg text-white space-y-2`}
            >
              <div className="font-semibold text-lg">
                ⭐{" "}
                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}{" "}
                Badge
              </div>
              <p className="text-sm opacity-90">
                {rarityDescriptions[badge.rarity]}
              </p>
            </div>
          </div>

          {/* Badge Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg border border-primary/10">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                Collection Number
              </h4>
              <p className="text-2xl font-bold text-foreground">
                #{badge.sequenceNumber}
              </p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border border-primary/10">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                Claimed Date
              </h4>
              <p className="text-sm text-foreground">
                {formatDate(badge.claimedAt)}
              </p>
            </div>

            {badge.event.location && (
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/10 md:col-span-2">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                  Event Location
                </h4>
                <p className="text-sm text-foreground">
                  {badge.event.location}
                </p>
              </div>
            )}

            <div className="bg-muted/30 p-4 rounded-lg border border-primary/10 md:col-span-2">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                Event Date Range
              </h4>
              <p className="text-sm text-foreground">
                {new Date(badge.event.startTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                to{" "}
                {new Date(badge.event.endTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Token Information */}
          {badge.tokenId && (
            <div className="bg-muted/30 p-4 rounded-lg border border-primary/10">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                Token Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Token ID
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background px-3 py-2 rounded text-xs font-mono break-all">
                      {badge.tokenId}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyToken}
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a
                    href={`https://explorer.stacks.co/txid/${badge.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Stacks Explorer
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-primary/10">
            <Button onClick={handleShare} className="flex-1 gap-2">
              <Share2 className="h-4 w-4" />
              Share Badge
            </Button>
            <Button asChild variant="outline" className="flex-1 gap-2">
              <a href={`/events/${badge.event.id}`}>View Event</a>
            </Button>
          </div>

          {/* Achievement Info */}
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              This badge proves your attendance at the{" "}
              <span className="font-semibold text-foreground">
                {badge.event.title}
              </span>{" "}
              event and is permanently recorded on the Stacks blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
