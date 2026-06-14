import { useState, useEffect } from "react";
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
import axios from "axios";

export function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/activities")
      .then((res) => {
        setActivities(res.data);
      })
      .catch((err) => {
        console.error("fetching error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    setIsLoggedIn(false);
    navigate("/");
  };

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

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="">
                <img src={logo} alt="logo" className="w-20 h-8 object-cover" />
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/feed"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Activities
              </Link>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:opacity-90 cursor-pointer"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </nav>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground"
            >
              <Menu size={24} />
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-3 border-t border-border">
              <Link
                to="/feed"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Activities
              </Link>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="mx-4 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-accent/20 to-secondary/30">
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={isLoggedIn ? "/feed" : "/auth"}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {isLoggedIn ? "Explore Feed" : "Join Now"}
              </Link>
              <Link
                to={isLoggedIn ? "/create" : "/auth"}
                className="px-8 py-4 bg-card text-foreground border-2 border-primary rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                Create Activity
              </Link>
            </div>
          </div>
        </div>
      </section>

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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold">Trending Activities</h2>
          <Link to="/feed" className="text-primary font-medium hover:underline">
            View All
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse"
              >
                <div className="h-48 bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...activities]
              .filter((a: any) => a.participants < a.maxParticipants) // hide full events
              .sort((a: any, b: any) => {
                const spotsA = a.maxParticipants - a.participants;
                const spotsB = b.maxParticipants - b.participants;
                if (spotsA !== spotsB) return spotsA - spotsB;
                const timeA = new Date(`${a.date} ${a.time}`).getTime();
                const timeB = new Date(`${b.date} ${b.time}`).getTime();
                return timeA - timeB;
              })
              .slice(0, 3)
              .map((activity: any) => (
              <Link
                key={activity._id}
                to={`/activity/${activity._id}`}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  {activity.image ? (
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundImage: `url(${activity.image})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
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
        )}

        {!loading && activities.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No activities yet.</p>
          </div>
        )}
      </section>

      <section className="bg-linear-to-br from-primary via-[#FF7F50] to-accent py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Connect?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of international students making friends and creating
            memories in Korea
          </p>
          <Link
            to={isLoggedIn ? "/feed" : "/auth"}
            className="inline-block px-8 py-4 bg-white text-primary rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {isLoggedIn ? "Explore Activities" : "Get Started - It's Free"}
          </Link>
        </div>
      </section>
    </div>
  );
}
