import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
  PhoneOff,
  VideoOff,
  Mic,
  MicOff,
  X,
  MessageCircle,
} from "lucide-react";

export function ChatPage() {
  const { chatId } = useParams();
  const [messageInput, setMessageInput] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const conversations = [
    {
      id: "1",
      name: "Emma Wilson",
      avatar: "👩",
      lastMessage: "See you tomorrow at the cafe!",
      time: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Marco Silva",
      avatar: "👨",
      lastMessage: "Thanks for organizing!",
      time: "1h ago",
      unread: 0,
      online: true,
    },
    {
      id: "3",
      name: "Yuki Tanaka",
      avatar: "👩",
      lastMessage: "What time should we meet?",
      time: "3h ago",
      unread: 1,
      online: false,
    },
    {
      id: "group-1",
      name: "Korean Language Exchange",
      avatar: "🗣️",
      lastMessage: "Sarah: Looking forward to it!",
      time: "5h ago",
      unread: 5,
      online: false,
      isGroup: true,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "other",
      avatar: "👩",
      name: "Emma Wilson",
      text: "Hey! Are you going to the language exchange tomorrow?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "Yes! I'm really excited about it 😊",
      time: "10:32 AM",
    },
    {
      id: 3,
      sender: "me",
      text: "Have you been to that cafe before?",
      time: "10:32 AM",
    },
    {
      id: 4,
      sender: "other",
      avatar: "👩",
      name: "Emma Wilson",
      text: "Not yet, but I heard it has great coffee!",
      time: "10:35 AM",
    },
    {
      id: 5,
      sender: "other",
      avatar: "👩",
      name: "Emma Wilson",
      text: "Should we arrive a bit early to grab good seats?",
      time: "10:35 AM",
    },
    {
      id: 6,
      sender: "me",
      text: "Good idea! Maybe 15 minutes early?",
      time: "10:40 AM",
    },
    {
      id: 7,
      sender: "other",
      avatar: "👩",
      name: "Emma Wilson",
      text: "Perfect! See you tomorrow at the cafe! 👋",
      time: "10:42 AM",
    },
  ];

  const selectedConversation = chatId
    ? conversations.find((c) => c.id === chatId)
    : conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const startCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setIsCallActive(true);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallType(null);
  };

  return (
    <div className="h-[calc(100dvh-4rem)] lg:h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto h-full flex">
        {/* Conversations List */}
        <div
          className={`${
            chatId ? "hidden lg:flex" : "flex"
          } w-full lg:w-80 xl:w-96 flex-col border-r border-border bg-card`}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-2xl font-bold mb-4">
              Messages
            </h1>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/chat/${conversation.id}`}
                className={`flex items-center gap-3 p-4 hover:bg-muted transition-all border-b border-border ${
                  selectedConversation?.id === conversation.id
                    ? "bg-secondary"
                    : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-2xl">
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <div className="ml-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {chatId || selectedConversation ? (
          <div className="flex-1 flex flex-col bg-background">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/chat"
                  className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
                >
                  <ChevronLeft size={20} className="text-foreground" />
                </Link>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-xl">
                    {selectedConversation?.avatar}
                  </div>
                  {selectedConversation?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">
                    {selectedConversation?.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation?.online
                      ? "Active now"
                      : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startCall('voice')}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-all"
                >
                  <Phone size={20} />
                </button>
                <button
                  onClick={() => startCall('video')}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-all"
                >
                  <Video size={20} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "other" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {message.avatar}
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      message.sender === "me"
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card border border-border rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.text}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <form
                onSubmit={handleSendMessage}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) =>
                    setMessageInput(e.target.value)
                  }
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-background">
            <div className="text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle
                  size={40}
                  className="text-muted-foreground"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Select a conversation
              </h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start
                chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Call Modal */}
      {isCallActive && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            {/* Call Header */}
            <button
              onClick={endCall}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            >
              <X size={20} />
            </button>

            {/* Avatar and Name */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-6xl mb-4">
                {selectedConversation?.avatar}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedConversation?.name}
              </h2>
              <p className="text-white/70">
                {callType === 'video' ? 'Video calling...' : 'Voice calling...'}
              </p>
            </div>

            {/* Video Preview (for video calls) */}
            {callType === 'video' && !isVideoOff && (
              <div className="mb-8 w-full max-w-2xl aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <p className="text-white/50">Video preview</p>
              </div>
            )}

            {/* Call Controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isMuted
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-white/10 hover:bg-white/20'
                } text-white`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {callType === 'video' && (
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isVideoOff
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-white/10 hover:bg-white/20'
                  } text-white`}
                >
                  {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
              )}

              <button
                onClick={endCall}
                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all shadow-lg"
              >
                {callType === 'video' ? <VideoOff size={28} /> : <PhoneOff size={28} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
