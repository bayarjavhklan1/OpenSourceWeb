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
  members?: { name: string; avatar: string; country?: string }[];
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  interests: string[];
  createdAt: string;
  stats: {
    activitiesJoined: number;
    activitiesOrganized: number;
  };
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = !userId;

  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "organized">(
    "upcoming",
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const savedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    avatar: "🙂",
    bio: "",
    location: "",
    interests: [],
    createdAt: "",
    stats: {
      activitiesJoined: 0,
      activitiesOrganized: 0,
    },
  });

  useEffect(() => {
    if (!savedUser) {
      navigate("/auth");
      return;
    }

    const targetName = userId || savedUser.name;

    Promise.all([
      fetch("http://localhost:5001/users/" + targetName).then((r) => r.json()),
      fetch("http://localhost:5001/activities").then((r) => r.json()),
    ])
      .then(([userData, activitiesData]) => {
        const organized = activitiesData.filter(
          (a: ActivityItem) =>
            a.organizer && a.organizer.name === userData.name,
        );

        const joined = activitiesData.filter(
          (a: ActivityItem) =>
            Array.isArray(a.members) &&
            a.members.some((m) => m.name === userData.name) &&
            !(a.organizer && a.organizer.name === userData.name),
        );

        setUser({
          name: userData.name || "",
          email: userData.email || "",
          avatar: userData.avatar || "🙂",
          bio: userData.bio || "",
          location: userData.location || "",
          interests: userData.interests || [],
          createdAt: userData.createdAt || "",
          stats: {
            activitiesOrganized: organized.length,
            activitiesJoined: joined.length + organized.length,
          },
        });

        setAllActivities(activitiesData);
        setLoading(false);
      })
      .catch(() => {
        setUser((prev) => ({
          ...prev,
          name: savedUser.name || "",
          email: savedUser.email || "",
          avatar: savedUser.avatar || "🙂",
        }));
        setLoading(false);
      });
  }, [userId]);

  // Save profile changes to backend
  const handleSaveProfile = (updatedProfile: any) => {
    fetch("http://localhost:5001/users/" + user.name, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: updatedProfile.bio,
        location: updatedProfile.location,
        interests: updatedProfile.interests,
        avatar: updatedProfile.avatar || user.avatar,
      }),
    })
      .then((r) => r.json())
      .then((updated) => {
        setUser((prev) => ({
          ...prev,
          bio: updated.bio,
          location: updated.location,
          interests: updated.interests,
          avatar: updated.avatar,
        }));
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const fiveDaysLater = new Date(now.getTime() + 5 * MS_PER_DAY)
    .toISOString()
    .slice(0, 10);

  const sameName = (a?: string, b?: string) =>
    !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

  const mine = allActivities.filter(
    (a) =>
      sameName(a.organizer?.name, user.name) ||
      (Array.isArray(a.members) &&
        a.members.some((m) => sameName(m.name, user.name))),
  );

  const organized = allActivities.filter((a) =>
    sameName(a.organizer?.name, user.name),
  );
  if (typeof window !== "undefined") {
    console.log("[ProfilePage debug] user.name:", user.name);
    console.log(
      "[ProfilePage debug] activities sample:",
      allActivities.slice(0, 3).map((a) => ({
        title: a.title,
        date: a.date,
        organizer: a.organizer,
        members: a.members,
      })),
    );
  }

  const upcoming = mine.filter(
    (a) => a.date >= today && a.date <= fiveDaysLater,
  );

  const past = mine.filter((a) => a.date < today);

  const getActivities = () => {
    if (activeTab === "upcoming") return upcoming;
    if (activeTab === "past") return past;
    if (activeTab === "organized") return organized;
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border mb-6">
          <div className="flex flex-row gap-4 lg:gap-6 items-start">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-linear-to-br from-primary to-accent rounded-3xl flex items-center justify-center text-5xl lg:text-6xl shrink-0 ">
              {user.avatar}
            </div>
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
                    {user.email && (
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{user.email}</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
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

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex border-b border-border overflow-x-auto">
            {(["upcoming", "past", "organized"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-medium transition-all ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary bg-secondary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab === "upcoming"
                  ? "Upcoming"
                  : tab === "past"
                    ? "Past"
                    : "Organized"}
              </button>
            ))}
          </div>

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
                      className="w-24 h-24 rounded-xl bg-cover bg-center shrink-0"
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

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
