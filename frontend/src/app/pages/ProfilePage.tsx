import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Edit, MapPin, Calendar, Users, MessageCircle } from 'lucide-react';
import { EditProfileModal } from '../components/EditProfileModal';

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
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'organized'>('upcoming');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);

  const [user, setUser] = useState({
    name: '정재민', 
    email: 'jaemin@naver.com', 
    avatar: '😎', 
    bio: '안녕하세요! 소프트웨어공학 전공 정재민입니다.',
    location: '서울, 대한민국',
    joinedDate: '',
    interests: ['React', 'TypeScript', 'Node.js'] as string[],
    stats: {
      activitiesJoined: 0,
      activitiesOrganized: 0,
      followers: 1,
      following: 1,
    },
  });

  useEffect(() => {
    fetch('http://localhost:5000/activities')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        setAllActivities(data);

        // 내가 만든 모임 수 세기
        let count = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].organizer && data[i].organizer.name === user.name) {
            count++;
          }
        }

        setUser(function(prev) {
          return {
            ...prev,
            stats: { ...prev.stats, activitiesOrganized: count, activitiesJoined: count }
          };
        });
      })
      .catch((err) => console.error("데이터를 가져오는 중 오류 발생:", err));
  }, [user.name]);


  const handleSaveProfile = (updatedProfile: any) => {
    setUser({ ...user, ...updatedProfile });
  };

  // 오늘 날짜
  const today = new Date().toISOString().slice(0, 10);

  const organizedActivities = allActivities.filter(function(a) {
    return a.organizer && a.organizer.name === user.name;
  });

  const upcomingActivities = organizedActivities.filter(function(a) {
    return a.date >= today;
  });

  const pastActivities = organizedActivities.filter(function(a) {
    return a.date < today;
  });

  const getActivities = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingActivities;
      case 'past':
        return pastActivities;
      case 'organized':
        return organizedActivities;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
        <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border mb-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
        
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center text-5xl lg:text-6xl flex-shrink-0">
              {user.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">{user.name}</h1>
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
                <p className="text-muted-foreground mb-4 leading-relaxed">{user.bio}</p>
              )}

             
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{user.stats.activitiesJoined}</p>
                  <p className="text-xs text-muted-foreground">Joined</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{user.stats.activitiesOrganized}</p>
                  <p className="text-xs text-muted-foreground">Organized</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{user.stats.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{user.stats.following}</p>
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
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'text-primary border-b-2 border-primary bg-secondary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'past'
                  ? 'text-primary border-b-2 border-primary bg-secondary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setActiveTab('organized')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'organized'
                  ? 'text-primary border-b-2 border-primary bg-secondary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Organized
            </button>
          </div>

         
          <div className="p-6">
            {getActivities().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No activities yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {activeTab === 'organized'
                    ? 'Start organizing activities to build your community!'
                    : 'Join activities to connect with other students!'}
                </p>
                <Link
                  to={activeTab === 'organized' ? '/create' : '/feed'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {activeTab === 'organized' ? 'Create Activity' : 'Explore Activities'}
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
                        {'participants' in activity && (
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