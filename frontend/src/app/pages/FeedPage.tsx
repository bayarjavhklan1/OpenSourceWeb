import { useState } from 'react';
import { Search, Users, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { ActivityCard } from '../components/ActivityCard';

export function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Study Together', 'Eat Together', 'Exercise', 'Language Exchange', 'Travel', 'Hobbies'];

  const activities = [
    {
      id: 1,
      title: 'Korean Language Exchange @ Cafe',
      category: 'Language Exchange',
      location: 'Hongdae, Seoul',
      date: 'May 15, 2026',
      time: '6:00 PM',
      participants: 8,
      maxParticipants: 12,
      image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786',
      organizer: { name: 'Sarah Kim', avatar: '👩' },
      isFavorite: false,
    },
    {
      id: 2,
      title: 'Weekend Hiking to Bukhansan',
      category: 'Travel',
      location: 'Bukhansan National Park',
      date: 'May 17, 2026',
      time: '8:00 AM',
      participants: 15,
      maxParticipants: 20,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      organizer: { name: 'Mike Chen', avatar: '👨' },
      isFavorite: true,
    },
    {
      id: 3,
      title: 'Study Group - Midterm Prep',
      category: 'Study Together',
      location: 'University Library',
      date: 'May 14, 2026',
      time: '2:00 PM',
      participants: 6,
      maxParticipants: 8,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      organizer: { name: 'Emma Lee', avatar: '👩' },
      isFavorite: false,
    },
    {
      id: 4,
      title: 'Thai Food Cooking Night',
      category: 'Eat Together',
      location: 'Itaewon Community Kitchen',
      date: 'May 16, 2026',
      time: '7:00 PM',
      participants: 10,
      maxParticipants: 15,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
      organizer: { name: 'Alex Park', avatar: '👨' },
      isFavorite: false,
    },
    {
      id: 5,
      title: 'Morning Yoga in the Park',
      category: 'Exercise',
      location: 'Han River Park',
      date: 'May 14, 2026',
      time: '7:00 AM',
      participants: 12,
      maxParticipants: 20,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      organizer: { name: 'Julia Martinez', avatar: '👩' },
      isFavorite: true,
    },
    {
      id: 6,
      title: 'K-Pop Dance Cover Practice',
      category: 'Hobbies',
      location: 'Gangnam Dance Studio',
      date: 'May 18, 2026',
      time: '5:00 PM',
      participants: 7,
      maxParticipants: 10,
      image: 'https://images.unsplash.com/photo-1547153760-18fc9498cfc6',
      organizer: { name: 'David Kim', avatar: '👨' },
      isFavorite: false,
    },
  ];

  const filteredActivities = activities.filter((activity) => {
    const matchesCategory = selectedCategory === 'All' || activity.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Discover Activities</h1>
          <p className="text-muted-foreground">Find your next adventure with fellow students</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
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
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-foreground border border-border hover:bg-muted'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-20 lg:mb-8">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No activities found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or create a new activity!</p>
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
