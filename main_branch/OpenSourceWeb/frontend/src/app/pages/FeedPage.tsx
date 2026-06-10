import { useState, useEffect } from "react";
import { Search, Users, Plus } from "lucide-react";
import { Link } from "react-router";
import { ActivityCard } from "../components/ActivityCard";

export function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activities, setActivities] = useState<any[]>([]);

  const categories = [
    "All",
    "Study Together",
    "Eat Together",
    "Exercise",
    "Language Exchange",
    "Travel",
    "Hobbies",
  ];

  // 처음 켜질때 모임목록 불러오기
  useEffect(() => {
    fetch("http://localhost:5001/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data));
  }, []);

  // 카테고리 + 검색어로 거르기
  const shown = activities.filter((a) => {
    const okCat = selectedCategory === "All" || a.category === selectedCategory;
    const word = searchQuery.toLowerCase();
    const okWord =
      searchQuery === "" ||
      a.title.toLowerCase().includes(word) ||
      a.location.toLowerCase().includes(word) ||
      a.category.toLowerCase().includes(word);
    return okCat && okWord;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Discover Activities</h1>
          <p className="text-muted-foreground">
            Find your next adventure with fellow students
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-foreground border border-border hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-20 lg:mb-8">
          {shown.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </div>

        {/* Empty State */}
        {shown.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No activities found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or create a new activity!
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              Create Activity
            </Link>
          </div>
        )}

        {/* Floating Action Button - Mobile Only */}
        <Link
          to="/create"
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center lg:hidden z-40 hover:scale-110 transition-transform"
        >
          <Plus size={24} />
        </Link>
      </div>
    </div>
  );
}
