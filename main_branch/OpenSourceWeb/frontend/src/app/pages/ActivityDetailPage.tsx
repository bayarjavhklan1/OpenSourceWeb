import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import {
  MapPin,
  Calendar,
  Users,
  Heart,
  Share2,
  MessageCircle,
  ChevronLeft,
  Clock,
} from "lucide-react";

const API = "http://localhost:5001";

export function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const userRaw = localStorage.getItem("user");
  const currentUser = userRaw ? JSON.parse(userRaw) : null;
  const requireAuth = (action: () => void) => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    action();
  };

  useEffect(() => {
    axios
      .get(`${API}/activities/${id}`)
      .then((res) => {
        setActivity(res.data);
        const alreadyJoined = res.data.members?.some(
          (m: any) => m.name === currentUser?.name,
        );
        setIsJoined(alreadyJoined);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = () => {
    requireAuth(async () => {
      const action = isJoined ? "leave" : "join";
      const member = {
        name: currentUser.name,
        avatar: currentUser.avatar || "😊",
        country: currentUser.country || "Unknown",
      };
      try {
        const res = await axios.post(`${API}/activities/${id}/join`, {
          member,
          action,
        });
        setActivity(res.data);
        setIsJoined(!isJoined);
      } catch (err) {
        console.error("Join error:", err);
      }
    });
  };

  const handleComment = () => {
    requireAuth(async () => {
      if (!comment.trim()) return;
      try {
        const res = await axios.post(`${API}/activities/${id}/comments`, {
          user: { name: currentUser.name, avatar: currentUser.avatar || "😊" },
          text: comment,
        });
        setActivity((prev: any) => ({ ...prev, comments: res.data }));
        setComment("");
      } catch (err) {
        console.error("Comment error:", err);
      }
    });
  };

  const handleMessage = () => {
    requireAuth(() => {
      navigate(`/chat/organizer-${id}`);
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const diff = Math.floor((Date.now() - new Date(time).getTime()) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Activity not found.</p>
      </div>
    );
  }

  const spotsLeft = activity.maxParticipants - activity.participants;

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* Header Image */}
      <div className="relative h-56 sm:h-64 lg:h-96 bg-muted">
        {activity.image && (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${activity.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        <Link
          to="/feed"
          className="absolute top-4 left-4 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </Link>

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              size={20}
              className={`${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"} transition-colors`}
            />
          </button>
          <button className="w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Share2 size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">
          {activity.category}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Details */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h1 className="text-3xl font-bold mb-4">{activity.title}</h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center ">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.duration || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Users size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.participants}/{activity.maxParticipants} Joined
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {spotsLeft} spots left
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border my-6" />

              <div>
                <h2 className="font-semibold mb-3">About this activity</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {activity.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-4">Organizer</h2>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-accent rounded-2xl  items-center justify-center text-3xl  hidden sm:flex">
                  {activity.organizer?.avatar || "😊"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">
                    {activity.organizer?.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {activity.organizer?.bio ||
                      "Passionate about connecting international students"}
                  </p>
                </div>
                <button
                  onClick={handleMessage}
                  className="px-4 py-2 border border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all text-center sm:shrink-0"
                >
                  Message
                </button>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MessageCircle size={20} />
                Comments ({activity.comments?.length || 0})
              </h2>

              <div className="space-y-4 mb-4">
                {activity.comments?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No comments yet. Be the first!
                  </p>
                )}
                {activity.comments?.map((c: any, i: number) => (
                  <div key={i} className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg shrink-0">
                        {c.user.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{c.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(c.time)}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{c.text}</p>
                      </div>
                    </div>

                    {c.replies?.map((reply: any, j: number) => (
                      <div key={j} className="flex gap-3 ml-12">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center shrink-0">
                          {reply.user.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {reply.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(reply.time)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {reply.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg shrink-0">
                  {currentUser?.avatar || "😊"}
                </div>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleComment();
                  }}
                  placeholder={
                    currentUser ? "Add a comment..." : "Log in to comment..."
                  }
                  className="flex-1 px-4 py-2 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleComment}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="hidden lg:block bg-card rounded-2xl p-6 border border-border sticky top-20">
              <button
                onClick={handleJoin}
                disabled={!isJoined && spotsLeft <= 0}
                className={`w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all ${
                  isJoined
                    ? "bg-muted text-foreground border border-border"
                    : spotsLeft <= 0
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:scale-[1.02]"
                }`}
              >
                {isJoined
                  ? "Leave Activity"
                  : spotsLeft <= 0
                    ? "Full"
                    : "Join Activity"}
              </button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                {currentUser
                  ? `${spotsLeft} spots remaining`
                  : "Log in to join"}
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-4">
                Participants ({activity.participants})
              </h2>
              <div className="space-y-3">
                {activity.members?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No participants yet.
                  </p>
                )}
                {activity.members?.map((m: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg">
                      {m.avatar || "😊"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-linear-to-t from-background via-background to-transparent lg:hidden">
        <button
          onClick={handleJoin}
          disabled={!isJoined && spotsLeft <= 0}
          className={`w-full py-4 rounded-2xl font-semibold shadow-2xl transition-all ${
            isJoined
              ? "bg-muted text-foreground border-2 border-border"
              : spotsLeft <= 0
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground"
          }`}
        >
          {isJoined
            ? "Leave Activity"
            : spotsLeft <= 0
              ? "Full"
              : "Join Activity"}
        </button>
      </div>
    </div>
  );
}
