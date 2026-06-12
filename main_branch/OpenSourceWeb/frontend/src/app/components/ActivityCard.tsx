import { useState } from "react";
import { Users, MapPin, Calendar, Heart } from "lucide-react";
import { Link } from "react-router";

interface Activity {
  _id?: string;
  id?: number;
  title: string;
  category: string;
  location: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  image: string;
  organizer: {
    name: string;
    avatar: string;
  };
  isFavorite?: boolean;
}

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [isFavorite, setIsFavorite] = useState(activity.isFavorite);

  const aid = activity._id ?? activity.id;
  const pct = (activity.participants / activity.maxParticipants) * 100; // 몇 % 찼나

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all">
      <Link to={`/activity/${aid}`} className="block">
        <div className="relative h-48 overflow-hidden bg-muted">
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundImage: `url(${activity.image})` }}
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium">
            {activity.category}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              size={18}
              className={`${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"} transition-colors`}
            />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/activity/${aid}`}>
          <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {activity.title}
          </h3>
        </Link>

        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="shrink-0" />
            <span>
              {activity.date} • {activity.time}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={16} />
              <span>
                {activity.participants}/{activity.maxParticipants} joined
              </span>
            </div>
            <span className="text-xs font-medium">{Math.round(pct)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-accent transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg">
            {activity.organizer.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Organized by</p>
            <p className="text-sm font-medium truncate">
              {activity.organizer.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
