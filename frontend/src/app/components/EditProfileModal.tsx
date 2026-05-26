import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: {
    name: string;
    bio: string;
    location: string;
    interests: string[];
  };
  onSave: (profile: any) => void;
}

export function EditProfileModal({ isOpen, onClose, currentProfile, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(currentProfile.name);
  const [bio, setBio] = useState(currentProfile.bio);
  const [location, setLocation] = useState(currentProfile.location);
  const [interests, setInterests] = useState<string[]>(currentProfile.interests);
  const [newInterest, setNewInterest] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, bio, location, interests });
    onClose();
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-all"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block font-medium mb-3">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-4xl">
                👩
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-muted hover:bg-card border border-border rounded-xl transition-all flex items-center gap-2"
              >
                <Upload size={16} />
                Change Photo
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-medium mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Tell others about yourself..."
            />
            <p className="text-xs text-muted-foreground mt-2">
              {bio.length}/200 characters
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g., Seoul, Korea"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block font-medium mb-2">Interests</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                className="flex-1 px-4 py-2 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Add an interest..."
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-secondary text-foreground rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="hover:text-primary transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold border border-border hover:bg-card transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
