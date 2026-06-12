import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  MapPin,
  Calendar,
  Users,
  Type,
  AlignLeft,
  Tag,
  ChevronLeft,
  X,
} from "lucide-react";
import { Link } from "react-router";
import axios from "axios";

export function CreateActivityPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Study Together",
    "Eat Together",
    "Exercise",
    "Language Exchange",
    "Travel",
    "Hobbies",
    "Social Events",
    "Other",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert("카테고리를 선택해주세요");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await axios.post(
          "http://localhost:5001/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        if (!uploadRes.data.success) {
          alert("error senging image");
          return;
        }
        imageUrl = uploadRes.data.url;
      }

      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      const res = await axios.post("http://localhost:5001/activities", {
        title,
        category: selectedCategory,
        description,
        location,
        address,
        date,
        time,
        duration,
        maxParticipants: Number(maxParticipants),
        image: imageUrl,
        organizer: user
          ? { name: user.name, avatar: user.avatar || "" }
          : { name: "Anonymous", avatar: "" },
      });

      if (!res.data.success) {
        alert(res.data.message);
        return;
      }

      navigate("/feed");
    } catch (err) {
      console.error("warning:", err);
      alert("Again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/feed"
            className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border hover:bg-muted transition-all"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create Activity</h1>
            <p className="text-muted-foreground">
              Share your plans with the community
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="mb-3 flex items-center gap-2">
              <Upload size={18} className="text-primary" />
              <span className="font-medium">Cover Image</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-52 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30 block">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Upload size={24} className="text-primary" />
                </div>
                <p className="font-medium mb-1">Click to upload cover image</p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="mb-3 flex items-center gap-2">
              <Type size={18} className="text-primary" />
              <span className="font-medium">Activity Title</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Korean Language Exchange @ Cafe"
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="mb-3 flex items-center gap-2">
              <Tag size={18} className="text-primary" />
              <span className="font-medium">Category</span>
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    selectedCategory === category
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="mb-3 flex items-center gap-2">
              <AlignLeft size={18} className="text-primary" />
              <span className="font-medium">Description</span>
            </label>
            <textarea
              rows={5}
              placeholder="Describe your activity in detail..."
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              Include what participants should expect and bring
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <span className="font-medium">Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Hongdae, Seoul"
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Detailed address (optional)"
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span className="font-medium">Date & Time</span>
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">
                  Duration (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2 hours"
                  className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="mb-3 flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <span className="font-medium">Maximum Participants</span>
            </label>
            <input
              type="number"
              min="2"
              max="100"
              placeholder="e.g., 12"
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              Set a limit for how many people can join
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/feed")}
              className="flex-1 px-6 py-4 bg-muted text-foreground rounded-2xl font-semibold border border-border hover:bg-card transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? "Creating..." : "Create Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
