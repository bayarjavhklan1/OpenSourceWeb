import { useState } from "react";
import {
  Search,
  Users,
  MapPin,
  Calendar,
  Menu,
  Utensils,
  Dumbbell,
  Globe,
  Palette,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import logo from "../../assets/Screenshot 2026-05-25 at 22.17.52.png";
export function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/feed");
  };
  const categories = [
    {
      icon: Users,
      label: "Study Together",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Utensils,
      label: "Eat Together",
      color: "bg-orange-100 text-orange-600",
    },
    { icon: Dumbbell, label: "Exercise", color: "bg-green-100 text-green-600" },
    {
      icon: Globe,
      label: "Language Exchange",
      color: "bg-purple-100 text-purple-600",
    },
    { icon: MapPin, label: "Travel", color: "bg-pink-100 text-pink-600" },
    { icon: Palette, label: "Hobbies", color: "bg-yellow-100 text-yellow-600" },
  ];

  const featuredActivities = [
    {
      id: 1,
      title: "Korean Language Exchange @ Cafe",
      category: "Language Exchange",
      location: "Hongdae, Seoul",
      date: "May 15, 2026",
      time: "6:00 PM",
      participants: 8,
      maxParticipants: 12,
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
    },
    {
      id: 2,
      title: "Weekend Hiking to Bukhansan",
      category: "Travel",
      location: "Bukhansan National Park",
      date: "May 17, 2026",
      time: "8:00 AM",
      participants: 15,
      maxParticipants: 20,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    },
    {
      id: 3,
      title: "Study Group - Midterm Prep",
      category: "Study Together",
      location: "University Library",
      date: "May 14, 2026",
      time: "2:00 PM",
      participants: 6,
      maxParticipants: 8,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="">
                <img src={logo} alt="logo" className="w-20 h-8 object-cover" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/feed"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/feed"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Activities
              </Link>
              <Link
                to="/auth"
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-3 border-t border-border">
              <Link
                to="/feed"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/feed"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Activities
              </Link>
              <Link
                to="/auth"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="block mx-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRjZCNkIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAgMy4zMTQtMi42ODYgNi02IDZzLTYtMi42ODYtNi02IDIuNjg2LTYgNi02IDYgMi42ODYgNiA2Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              Connect with Students
              <br />
              <span className="text-primary">Across Korea</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join international students for studying, eating, exercising,
              language exchange, and social activities
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for activities, events, or interests..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Join Now
              </Link>
              <Link
                to="/create"
                className="px-8 py-4 bg-card text-foreground border-2 border-primary rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                Create Activity
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Explore Activities
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.label}
                to="/feed"
                className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border hover:shadow-lg transition-all hover:scale-105"
              >
                <div
                  className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center`}
                >
                  <Icon size={28} />
                </div>
                <span className="text-sm font-medium text-center">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Activities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold">Trending Activities</h2>
          <Link to="/feed" className="text-primary font-medium hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredActivities.map((activity) => (
            <Link
              key={activity.id}
              to={`/activity/${activity.id}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all"
            >
              <div className="relative h-48 overflow-hidden bg-muted">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundImage: `url(${activity.image})` }}
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium">
                  {activity.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {activity.date} • {activity.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>
                      {activity.participants}/{activity.maxParticipants}{" "}
                      participants
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-br from-primary via-[#FF7F50] to-accent py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Connect?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of international students making friends and creating
            memories in Korea
          </p>
          <Link
            to="/auth"
            className="inline-block px-8 py-4 bg-white text-primary rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Get Started - It's Free
          </Link>
        </div>
      </section>
    </div>
  );
}
