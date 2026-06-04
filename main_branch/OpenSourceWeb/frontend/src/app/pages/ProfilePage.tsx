import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Edit, MapPin, Calendar, Users, MessageCircle } from "lucide-react";
import { EditProfileModal } from "../components/EditProfileModal";

interface ActivityItem {
  _id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  image: string;
  participants?: number;
  maxParticipants?: number;
  organizer?: { name: string; avatar: string };
}

export function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = !userId;
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "organized">(
    "upcoming",
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);

  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const savedProfile = JSON.parse(localStorage.getItem("profile") || "null");

  const [user, setUser] = useState({
    name: savedUser ? savedUser.name : "",
    avatar: savedProfile ? savedProfile.avatar : "아바타",
    bio: savedProfile ? savedProfile.bio : "",
    location: savedProfile ? savedProfile.location : "",
    joinedDate: "",
    interests: savedProfile ? savedProfile.interests : [],
    stats: {
      activitiesJoined: 0,
      activitiesOrganized: 0,
      followers: 0,
      following: 0,
    },
  });

  useEffect(() => {
    if (!savedUser) {
      navigate("/auth");
      return;
    }

    fetch("http://localhost:5000/activities")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setAllActivities(data);

        // 내가 만든 모임 수 세기
        let count = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].organizer && data[i].organizer.name === savedUser.name) {
            count++;
          }
        }

        setUser(function (prev) {
          return {
            ...prev,
            stats: {
              ...prev.stats,
              activitiesOrganized: count,
              activitiesJoined: count,
            },
          };
        });
      });
  }, []);

  const handleSaveProfile = (updatedProfile: any) => {
    const newProfile = {
      bio: updatedProfile.bio,
      location: updatedProfile.location,
      interests: updatedProfile.interests,
      avatar: user.avatar,
    };
    localStorage.setItem("profile", JSON.stringify(newProfile));
    setUser({ ...user, ...updatedProfile });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    navigate("/");
  };

  // 오늘 날짜 (DB 날짜 형식이 "2026-06-01" 같은 문자열이라 그냥 비교)
  const today = new Date().toISOString().slice(0, 10);

  // 내가 만든 모임만 골라냄
  const mine = allActivities.filter(function (a) {
    return a.organizer && a.organizer.name === user.name;
  });
  const soon = mine.filter(function (a) {
    return a.date >= today;
  }); // 앞으로 할거
  const done = mine.filter(function (a) {
    return a.date < today;
  }); // 지난거

  const getActivities = () => {
    if (activeTab === "upcoming") return soon;
    if (activeTab === "past") return done;
    if (activeTab === "organized") return mine;
    return [];
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border mb-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center text-5xl lg:text-6xl flex-shrink-0">
              {user.avatar}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    {user.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {savedUser && (
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{savedUser.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-card border border-border transition-all flex items-center gap-2"
                  >
                    <Edit size={16} />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </button>
                )}
              </div>

              {user.bio && (
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {user.bio}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {user.stats.activitiesJoined}
                  </p>
                  <p className="text-xs text-muted-foreground">Joined</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {user.stats.activitiesOrganized}
                  </p>
                  <p className="text-xs text-muted-foreground">Organized</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {user.stats.followers}
                  </p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {user.stats.following}
                  </p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>

              {!isOwnProfile && (
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-lg transition-all">
                    Follow
                  </button>
                  <button className="flex-1 px-4 py-2 bg-muted text-foreground rounded-xl font-semibold hover:bg-card border border-border transition-all flex items-center justify-center gap-2">
                    <MessageCircle size={16} />
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="mt-6 pt-6 border-t border-border">
            <h2 className="font-semibold mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest: string) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-secondary text-foreground rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 border-2 border-dashed border-border text-muted-foreground rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-all"
                >
                  + Add Interest
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Activity Tabs */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === "upcoming"
                  ? "text-primary border-b-2 border-primary bg-secondary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === "past"
                  ? "text-primary border-b-2 border-primary bg-secondary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setActiveTab("organized")}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === "organized"
                  ? "text-primary border-b-2 border-primary bg-secondary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Organized
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {getActivities().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No activities yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {activeTab === "organized"
                    ? "Start organizing activities to build your community!"
                    : "Join activities to connect with other students!"}
                </p>
                <Link
                  to={activeTab === "organized" ? "/create" : "/feed"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {activeTab === "organized"
                    ? "Create Activity"
                    : "Explore Activities"}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {getActivities().map((activity) => (
                  <Link
                    key={activity._id}
                    to={`/activity/${activity._id}`}
                    className="group flex gap-4 p-4 bg-background rounded-xl hover:shadow-lg transition-all border border-border"
                  >
                    <div
                      className="w-24 h-24 rounded-xl bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${activity.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {activity.title}
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span className="truncate">{activity.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span className="truncate">{activity.location}</span>
                        </div>
                        {"participants" in activity && (
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>
                              {activity.participants}/{activity.maxParticipants}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 hover:opacity-90 transition-all cursor-pointer"
            >
              Log out
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
