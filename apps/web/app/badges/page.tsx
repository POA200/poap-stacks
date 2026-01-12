"use client";

import { useState } from "react";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";

type TimeFilter = "all" | "week" | "month";
type BadgeType = "attendance" | "achievement" | "special";
type SortOption = "newest" | "oldest" | "alphabetical";

interface Badge {
  id: string;
  title: string;
  date: Date;
  type: BadgeType;
}

// Mock badge data - static to prevent hydration mismatch
const MOCK_BADGES: Badge[] = Array.from({ length: 12 }, (_, i) => ({
  id: `badge-${i + 1}`,
  title: `Badge ${i + 1}`,
  date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000),
  type: ["attendance", "achievement", "special"][i % 3] as BadgeType,
}));

const BADGES_PER_PAGE = 6;

export default function BadgesPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [badgeType, setBadgeType] = useState<BadgeType>("attendance");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter badges based on time filter
  const filterByTime = (badges: Badge[], filter: TimeFilter): Badge[] => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case "week":
        return badges.filter((b) => b.date >= oneWeekAgo);
      case "month":
        return badges.filter((b) => b.date >= oneMonthAgo);
      case "all":
      default:
        return badges;
    }
  };

  // Sort badges
  const sortBadges = (badges: Badge[], option: SortOption): Badge[] => {
    const sorted = [...badges];
    switch (option) {
      case "newest":
        return sorted.sort((a, b) => b.date.getTime() - a.date.getTime());
      case "oldest":
        return sorted.sort((a, b) => a.date.getTime() - b.date.getTime());
      case "alphabetical":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  // Apply filters and sorting
  const filteredBadges = filterByTime(MOCK_BADGES, timeFilter);
  const sortedBadges = sortBadges(filteredBadges, sortBy);

  // Paginate
  const totalPages = Math.ceil(sortedBadges.length / BADGES_PER_PAGE);
  const startIdx = (currentPage - 1) * BADGES_PER_PAGE;
  const displayedBadges = sortedBadges.slice(
    startIdx,
    startIdx + BADGES_PER_PAGE
  );

  const handleTimeFilterClick = (filter: TimeFilter) => {
    setTimeFilter(filter);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-xl bg-primary/10">
              <Award className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-medium text-foreground mb-2">
            My Badge Collection
          </h1>
          <p className="text-muted-foreground">
            Track your on-chain achievements and history.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Time Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleTimeFilterClick("all")}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
                timeFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleTimeFilterClick("week")}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
                timeFilter === "week"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => handleTimeFilterClick("month")}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
                timeFilter === "month"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              This Month
            </button>

            {/* Divider */}
            <div className="h-5 w-px bg-border mx-1" />

            {/* Type Dropdown */}
            <label className="text-xs font-medium text-muted-foreground">
              Type:
            </label>
            <select
              value={badgeType}
              onChange={(e) => setBadgeType(e.target.value as BadgeType)}
              className="px-2.5 py-1.5 text-sm rounded-full border border-input bg-muted text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="attendance">Attendance</option>
              <option value="achievement">Achievement</option>
              <option value="special">Special</option>
            </select>

            {/* Sort Dropdown */}
            <label className="text-xs font-medium text-muted-foreground">
              Sort:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 text-sm rounded-full border border-input bg-muted text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="mb-8">
          {displayedBadges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="group relative aspect-square rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                  {/* Badge Content Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">
                        {badge.title}
                      </p>
                      <p className="text-white/70 text-xs mt-1">
                        {badge.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No badges found for the selected filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`h-9 w-9 rounded-full font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
