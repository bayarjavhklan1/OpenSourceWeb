import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import { Search, Send, ChevronLeft, MessageCircle } from "lucide-react";

let lastId = "";
let msgArr: any[] = [];

export function ChatPage() {
  const { chatId } = useParams();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [translations, setTranslations] = useState<{ [key: string]: string }>(
    {},
  );
  const [targetLang, setTargetLang] = useState("en");
  const [sourceLang, setSourceLang] = useState("en");

  const myName = "나";

  function formatTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return min + "m before";
    const hr = Math.floor(min / 60);
    if (hr < 24) return hr + "h before";
    return Math.floor(hr / 24) + "h before";
  }

  const loadMsg = useCallback(() => {
    const room = chatId || "1";
    let url = "http://localhost:5001/chat/messages?room=" + room;
    if (lastId) url += "&lastId=" + lastId;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          msgArr = msgArr.concat(data);
          setMessages([...msgArr]);
          lastId = data[data.length - 1]._id;
        }
      });
  }, [chatId]);

  const loadRooms = useCallback(() => {
    fetch("http://localhost:5001/chat/rooms")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((r: any) => ({
          id: r._id,
          name: r._id,
          avatar: "💬",
          lastMessage: r.lastMessage,
          time: formatTime(r.lastTime),
          unread: 0,
          online: false,
        }));
        setConversations(mapped);
      });
  }, []);

  useEffect(() => {
    msgArr = [];
    lastId = "";
    loadMsg();

    const timer = setInterval(loadMsg, 5000);
    return () => clearInterval(timer);
  }, [chatId, loadMsg]);

  useEffect(() => {
    loadRooms();
    const timer = setInterval(loadRooms, 10000);
    return () => clearInterval(timer);
  }, [loadRooms]);

  const selectedConversation = chatId
    ? conversations.find((c) => c.id === chatId)
    : conversations[0];

  function translateMessage(messageId: string, text: string) {
    fetch("http://localhost:5001/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, from: sourceLang, to: targetLang }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTranslations((prev) => ({
            ...prev,
            [messageId]: data.translatedText,
          }));
        } else {
          alert("Орчуулга амжилтгүй боллоо");
        }
      });
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    fetch("http://localhost:5001/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_room: chatId || "1",
        sender_name: myName,
        message_text: messageInput,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setMessageInput("");
        loadMsg();
      });
  };

  return (
    <div className="h-[calc(100dvh-4rem)] lg:h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto h-full flex">
        <div
          className={`${
            chatId ? "hidden lg:flex" : "flex"
          } w-full lg:w-80 xl:w-96 flex-col border-r border-border bg-card`}
        >
          <div className="p-4 border-b border-border">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
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
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
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

        {chatId || selectedConversation ? (
          <div className="flex-1 flex flex-col bg-background">
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
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">
                    {selectedConversation?.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation?.online ? "Онлайн" : "Оффлайн"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="px-2 py-1 bg-muted rounded-lg text-sm border border-border focus:outline-none"
                >
                  <option value="en">to: EN</option>
                  <option value="ko">to: KO</option>
                  <option value="mn">to: MN</option>
                </select>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="px-2 py-1 bg-muted rounded-lg text-sm border border-border focus:outline-none"
                >
                  <option value="en">from: EN</option>
                  <option value="ko">from: KO</option>
                  <option value="mn">from: MN</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isMe = msg.sender_name === myName;
                const d = new Date(msg.created_at);
                const timeStr =
                  d.getHours() +
                  ":" +
                  (d.getMinutes() < 10 ? "0" : "") +
                  d.getMinutes();

                return (
                  <div
                    key={msg._id}
                    className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {selectedConversation?.avatar}
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isMe
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-card border border-border rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {msg.message_text}
                        </p>
                        {translations[msg._id] ? (
                          <p className="text-xs mt-2 pt-2 border-t border-white/20 italic opacity-80">
                            🌐 {translations[msg._id]}
                          </p>
                        ) : (
                          <button
                            onClick={() =>
                              translateMessage(msg._id, msg.message_text)
                            }
                            className="text-xs mt-1 opacity-60 hover:opacity-100 underline"
                          >
                            Translate
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-2">
                        {timeStr}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-border bg-card">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Message..."
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
              <h3 className="text-xl font-semibold mb-2">Select chat</h3>
              <p className="text-muted-foreground">
                Чат эхлүүлэхийн тулд жагсаалтаас яриа сонгоно уу
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
