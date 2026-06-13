import { useState, useEffect } from "react";
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

let lastId = "";
let msgArr: any[] = [];

export function ChatPage() {
  const { chatId } = useParams();
  const [messageInput, setMessageInput] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video" | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
 const storedUser = localStorage.getItem("user");
const myName = storedUser ? JSON.parse(storedUser).name : "Guest";
  // Translations: key = messageId + targetLang, value = translated text
  const [translations, setTranslations] = useState<{[key: string]: string}>({});
  const [targetLang, setTargetLang] = useState("en");
  const [sourceLang, setSourceLang] = useState("ko");

  // Search query for conversations
  const [searchQuery, setSearchQuery] = useState("");
const [conversations, setConversations] = useState<any[]>([]);

// Load chat rooms from backend
useEffect(() => {
  fetch("http://localhost:5001/chat/rooms")
    .then((res) => res.json())
    .then((rooms) => {
      // Get current user's name from localStorage
      var userStr = localStorage.getItem("user");
      var currentUser = userStr ? JSON.parse(userStr).name : "";

      // Convert backend rooms to conversation format
      const convList = rooms.map((r: any) => {
        // Find the OTHER user's name (not me)
        var otherUsers = (r.participants || []).filter((p: string) => p !== currentUser);
        var displayName = otherUsers.length > 0 ? otherUsers.join(", ") : (r.lastSender || "Unknown");
        
        return {
          id: r._id,
          name: displayName,
          avatar: "👤",
          lastMessage: r.lastMessage || "No messages yet",
          time: r.lastTime ? new Date(r.lastTime).toLocaleString() : "",
          unread: 0,
          online: false,
        };
      });
      setConversations(convList);
    })
    .catch(() => {
      setConversations([]);
    });
}, []);
  function loadMsg() {
    let room = chatId || "1";
    let url = "http://localhost:5001/chat/messages?room=" + room;
    if (lastId) url = url + "&lastId=" + lastId;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          msgArr = msgArr.concat(data);
          setMessages(msgArr);
          lastId = data[data.length - 1]._id;
        }
      });
  }

  useEffect(() => {
    msgArr = [];
    lastId = "";
    setMessages([]);
    setTranslations({});
    loadMsg();

    let timer = setInterval(() => {
      loadMsg();
    }, 5000);

    return () => clearInterval(timer);
  }, [chatId]);


  // Filter conversations based on search query (case-insensitive)
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  const selectedConversation = chatId
    ? conversations.find((c) => c.id === chatId)
    : conversations[0];

  // Translate a message - stores result by messageId + targetLang
  // So same message can be translated to multiple languages
  function translateMessage(messageId: string, text: string) {
    const key = messageId + "_" + targetLang;

    // Already translated to this language? Skip API call
    if (translations[key]) return;

    fetch("http://localhost:5001/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, from: sourceLang, to: targetLang }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTranslations((prev) => ({ ...prev, [key]: data.translatedText }));
        } else {
          alert("Translation failed");
        }
      });
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    fetch("http://localhost:5001/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_room: chatId || "1", sender_name: myName, message_text: messageInput }),
    })
      .then((res) => res.json())
      .then(() => {
        setMessageInput("");
        loadMsg();
      });
  };

  const startCall = (type: "voice" | "video") => {
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
          <div className="p-4 border-b border-border">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  to={`/chat/${conversation.id}`}
                  className={`flex items-center gap-3 p-4 hover:bg-muted transition-all border-b border-border ${
                    selectedConversation?.id === conversation.id ? "bg-secondary" : ""
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
                      <h3 className="font-semibold truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <div className="ml-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {chatId || selectedConversation ? (
          <div className="flex-1 flex flex-col bg-background">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/chat" className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
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
                  <h2 className="font-semibold">{selectedConversation?.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation?.online ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="px-2 py-1 bg-muted rounded-lg text-sm border border-border focus:outline-none"
                >
                  <option value="en">From: EN</option>
                  <option value="ko">From: KO</option>
                  <option value="mn">From: MN</option>
                  <option value="ja">From: JA</option>
                  <option value="zh">From: ZH</option>
                </select>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="px-2 py-1 bg-muted rounded-lg text-sm border border-border focus:outline-none"
                >
                  <option value="en">To: EN</option>
                  <option value="ko">To: KO</option>
                  <option value="mn">To: MN</option>
                  <option value="ja">To: JA</option>
                  <option value="zh">To: ZH</option>
                </select>
               
              </div>
            </div>

            {/* Messages - two-sided layout */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
  {messages.length === 0 ? (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageCircle size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No messages yet</h3>
        <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
      </div>
    </div>
  ) : (
    messages.map((msg) => {
                const isMe = msg.sender_name === myName;
                const d = new Date(msg.created_at);
                const timeStr = d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
                const translationKey = msg._id + "_" + targetLang;
                const currentTranslation = translations[translationKey];

                return (
                  <div key={msg._id} className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                    {!isMe && (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {selectedConversation?.avatar}
                      </div>
                    )}
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      {!isMe && (
                        <p className="text-xs text-muted-foreground mb-1 px-2">{msg.sender_name}</p>
                      )}
                      <div className={`px-4 py-2 rounded-2xl ${isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md"}`}>
                        <p className="text-sm leading-relaxed">{msg.message_text}</p>
                        {currentTranslation && (
                          <p className="text-xs mt-2 pt-2 border-t border-white/20 italic opacity-80">
                            🌐 {currentTranslation}
                          </p>
                        )}
                        <button
                          onClick={() => translateMessage(msg._id, msg.message_text)}
                          className="text-xs mt-1 opacity-60 hover:opacity-100 underline"
                        >
                          {currentTranslation ? "Translate again" : "Translate"}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-2">
                        <p className="text-xs text-muted-foreground">{timeStr}</p>
                      </div>
                    </div>
                  </div>
         );
              })
            )}
            </div>
            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
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
                <MessageCircle size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Call Modal */}
      {isCallActive && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <button onClick={endCall} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-6xl mb-4">
                {selectedConversation?.avatar}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedConversation?.name}</h2>
              <p className="text-white/70">{callType === "video" ? "Video calling..." : "Voice calling..."}</p>
            </div>
            {callType === "video" && !isVideoOff && (
              <div className="mb-8 w-full max-w-2xl aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <p className="text-white/50">Video preview</p>
              </div>
            )}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-white/10 hover:bg-white/20"} text-white`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              {callType === "video" && (
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-white/10 hover:bg-white/20"} text-white`}
                >
                  {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
              )}
              <button onClick={endCall} className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all shadow-lg">
                {callType === "video" ? <VideoOff size={28} /> : <PhoneOff size={28} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}