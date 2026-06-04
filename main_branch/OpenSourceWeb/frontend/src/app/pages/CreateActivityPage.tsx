import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, MapPin, Calendar, Users, Type, AlignLeft, Tag, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

export function CreateActivityPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  const categories = [
    'Study Together',
    'Eat Together',
    'Exercise',
    'Language Exchange',
    'Travel',
    'Hobbies',
    'Social Events',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const obj = {
      title: title, category: selectedCategory, description: description,
      location: location, address: address, date: date, time: time,
      duration: duration, maxParticipants: maxParticipants
    };

    fetch('http://localhost:5000/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          alert(data.message);
          return;
        }
        navigate('/feed');
      });
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/feed"
            className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border hover:bg-muted transition-all"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create Activity</h1>
            <p className="text-muted-foreground">Share your plans with the community</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="block mb-3 flex items-center gap-2">
              <Upload size={18} className="text-primary" />
              <span className="font-medium">Cover Image</span>
            </label>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Upload size={24} className="text-primary" />
              </div>
              <p className="font-medium mb-1">Click to upload cover image</p>
              <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Activity Title */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="block mb-3 flex items-center gap-2">
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

          {/* Category */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="block mb-3 flex items-center gap-2">
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
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="block mb-3 flex items-center gap-2">
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

          {/* Location */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="block mb-3 flex items-center gap-2">
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

          {/* Date and Time */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="block mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span className="font-medium">Date & Time</span>
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">Duration (optional)</label>
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

          {/* Participant Limit */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <label className="block mb-3 flex items-center gap-2">
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

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="flex-1 px-6 py-4 bg-muted text-foreground rounded-2xl font-semibold border border-border hover:bg-card transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
