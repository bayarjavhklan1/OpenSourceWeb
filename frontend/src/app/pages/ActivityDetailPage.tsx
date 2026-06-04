import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { MapPin, Calendar, Users, Heart, Share2, MessageCircle, ChevronLeft, Clock } from 'lucide-react';

export function ActivityDetailPage() {
  const [id, setId] = useState<string>("");
  const [chamGo, setChamGo] = useState(false);
  const [jjim, setJjim] = useState(false);
  const [moim, setMoim] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/activities/' + id)
      .then(res => res.json())
      .then(data => setMoim(data));
  }, [id]);

  if (!moim) {
    return <div className="min-h-screen">불러오는 중...</div>;
  }

  const saramDeul = [
    { id: 1, name: 'Sarah Kim', avatar: '👩', country: 'USA' },
    { id: 2, name: 'Yuki Tanaka', avatar: '👩', country: 'Japan' },
    { id: 3, name: 'Marco Silva', avatar: '👨', country: 'Brazil' },
    { id: 4, name: 'Emma Wilson', avatar: '👩', country: 'UK' },
    { id: 5, name: 'Chen Wei', avatar: '👨', country: 'China' },
    { id: 6, name: 'Anna Müller', avatar: '👩', country: 'Germany' },
    { id: 7, name: 'Omar Hassan', avatar: '👨', country: 'Egypt' },
    { id: 8, name: 'Lisa Park', avatar: '👩', country: 'Canada' },
  ];

  const daetgeul = [
    {
      id: 1,
      user: { name: 'Emma Wilson', avatar: '👩' },
      text: 'This sounds amazing! Can beginners join?',
      time: '2 hours ago',
      replies: [
        {
          id: 11,
          user: { name: 'Sarah Kim', avatar: '👩' },
          text: 'Absolutely! All levels are welcome 😊',
          time: '1 hour ago',
        },
      ],
    },
    {
      id: 2,
      user: { name: 'Marco Silva', avatar: '👨' },
      text: 'Looking forward to this! See everyone there!',
      time: '5 hours ago',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* Header Image */}
      <div className="relative h-56 sm:h-64 lg:h-96 bg-muted">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${moim.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back Button */}
        <Link
          to="/feed"
          className="absolute top-4 left-4 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setJjim(!jjim)}
            className="w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              size={20}
              className={`${jjim ? 'fill-primary text-primary' : 'text-muted-foreground'} transition-colors`}
            />
          </button>
          <button className="w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Share2 size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">
          {moim.category}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Details */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h1 className="text-3xl font-bold mb-4">{moim.title}</h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{moim.location}</p>
                    <p className="text-sm text-muted-foreground">{moim.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{moim.date}</p>
                    <p className="text-sm text-muted-foreground">{moim.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{moim.duration}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{moim.participants}/{moim.maxParticipants} Joined</p>
                    <p className="text-sm text-muted-foreground">{moim.maxParticipants - moim.participants} spots left</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border my-6" />

              <div>
                <h2 className="font-semibold mb-3">About this activity</h2>
                <p className="text-muted-foreground leading-relaxed">{moim.description}</p>
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-4">Organizer</h2>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                  {moim.organizer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{moim.organizer.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{moim.organizer.bio}</p>
                  <p className="text-xs text-muted-foreground">
                    Organized {moim.organizer.activitiesOrganized} activities
                  </p>
                </div>
                <Link
                  to={`/chat/organizer-${id}`}
                  className="px-4 py-2 border border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all text-center sm:flex-shrink-0"
                >
                  Message
                </Link>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MessageCircle size={20} />
                Comments ({daetgeul.length})
              </h2>

              <div className="space-y-4 mb-4">
                {daetgeul.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {comment.user.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="text-xs text-muted-foreground">{comment.time}</span>
                        </div>
                        <p className="text-muted-foreground">{comment.text}</p>
                      </div>
                    </div>

                    {comment.replies?.map((reply) => (
                      <div key={reply.id} className="flex gap-3 ml-12">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                          {reply.user.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{reply.user.name}</span>
                            <span className="text-xs text-muted-foreground">{reply.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  😊
                </div>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Join Button */}
            <div className="hidden lg:block bg-card rounded-2xl p-6 border border-border sticky top-20">
              <button
                onClick={() => setChamGo(!chamGo)}
                className={`w-full py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all ${
                  chamGo
                    ? 'bg-muted text-foreground border border-border'
                    : 'bg-primary text-primary-foreground hover:scale-[1.02]'
                }`}
              >
                {chamGo ? 'Leave Activity' : 'Join Activity'}
              </button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                {moim.maxParticipants - moim.participants} spots remaining
              </p>
            </div>

            {/* Participants */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-semibold mb-4">
                Participants ({moim.participants})
              </h2>
              <div className="space-y-3">
                {saramDeul.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg">
                      {participant.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{participant.name}</p>
                      <p className="text-xs text-muted-foreground">{participant.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Join Button - Mobile */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent lg:hidden">
        <button
          onClick={() => setChamGo(!chamGo)}
          className={`w-full py-4 rounded-2xl font-semibold shadow-2xl transition-all ${
            chamGo
              ? 'bg-muted text-foreground border-2 border-border'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {chamGo ? 'Leave Activity' : 'Join Activity'}
        </button>
      </div>
    </div>
  );
}
