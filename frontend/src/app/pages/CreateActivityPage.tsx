import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, MapPin, Calendar, Users, Type, AlignLeft, Tag, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';
import { activityService, uploadService } from '../../api/services';

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
  const [maxParticipants, setMaxParticipants] = useState<number>(12);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }
    
    setIsLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const uploadRes = await uploadService.uploadImage(imageFile);
        imageUrl = uploadRes.data.imageUrl;
      }

      await activityService.create({
        title,
        category: selectedCategory,
        description,
        location,
        address,
        date,
        time,
        duration,
        maxParticipants,
        image: imageUrl || 'https://images.unsplash.com/photo-1556761175-4b46a572b786', // Fallback
      });
      navigate('/feed');
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('Failed to create activity.');
    } finally {
      setIsLoading(false);
    }
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
            <label className="block border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30 relative">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Upload size={24} className="text-primary" />
              </div>
              <p className="font-medium mb-1">{imageFile ? imageFile.name : 'Click to upload cover image'}</p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG up to 10MB
              </p>
            </label>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
              required
            />
            <input
              type="text"
              placeholder="Detailed address (optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">Duration (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., 2 hours"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              disabled={isLoading}
              className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
