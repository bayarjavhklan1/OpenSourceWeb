import { useState, useEffect, useRef } from "react";

export function ChatPage() {
 
  const [activeChatId, setActiveChatId] = useState<string>(""); 
  
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const lastIdRef = useRef('');
  const myName = 'Me';


  function loadMessages(currentLastId: string) {
    var room = activeChatId || '1';
    var url = 'http://localhost:5000/chat/messages?room=' + room;
    if (currentLastId) {
      url = url + '&lastId=' + currentLastId;
    }

    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.length > 0) {
          setMessages(function(prev) { return prev.concat(data); });
          lastIdRef.current = data[data.length - 1]._id; 
        }
      });
  }

  useEffect(function() {
    setMessages([]);
    lastIdRef.current = '';
    loadMessages('');

    var timer = setInterval(function() {
      loadMessages(lastIdRef.current);
    }, 5000);

    return function() { clearInterval(timer); };
  }, [activeChatId]);

  

  const conversations = [
    { id: "1", name: "Emma Wilson", avatar: "👩", lastMessage: "See you tomorrow at the cafe!", time: "2m ago", unread: 2, online: true },
    { id: "2", name: "Marco Silva", avatar: "👨", lastMessage: "Thanks for organizing!", time: "1h ago", unread: 0, online: true },
    { id: "3", name: "Yuki Tanaka", avatar: "👩", lastMessage: "What time should we meet?", time: "3h ago", unread: 1, online: false },
    { id: "group-1", name: "Korean Language Exchange", avatar: "🗣️", lastMessage: "Sarah: Looking forward to it!", time: "5h ago", unread: 5, online: false, isGroup: true },
  ];

  const selectedConversation = activeChatId
    ? conversations.find((c) => c.id === activeChatId)
    : conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    fetch('http://localhost:5000/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_room: activeChatId || '1', // activeChatId 사용
        sender_name: myName,
        message_text: messageInput
      })
    })
      .then(function(res) { return res.json(); })
      .then(function() {
        setMessageInput('');
        loadMessages(lastIdRef.current);
      });
  };

  return (
    <div className="h-[calc(100dvh-4rem)] lg:h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto h-full flex">
        {/* Conversations List */}
        <div
          className={`${
            activeChatId ? "hidden lg:flex" : "flex"
          } w-full lg:w-80 xl:w-96 flex-col border-r border-border bg-card`}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <div className="relative">
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
              /* Link 컴포넌트 대신 일반 button을 쓰고, onClick으로 상태를 변경하도록 수정 */
              <button
                key={conversation.id}
                onClick={() => setActiveChatId(conversation.id)}
                className={`w-full text-left flex items-center gap-3 p-4 hover:bg-muted transition-all border-b border-border ${
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
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeChatId || selectedConversation ? (
          <div className="flex-1 flex flex-col bg-background">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* 뒤로가기 버튼 클릭 시 activeChatId를 비워줌 (목록으로 돌아가기) */}
                <button
                  onClick={() => setActiveChatId("")}
                  className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
                >
                  ◀
                </button>
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
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(function(msg) {
                var isMe = msg.sender_name === myName;
                var d = new Date(msg.created_at);
                var timeStr = d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

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
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isMe ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-2 rounded-2xl ${isMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md"}`}>
                        <p className="text-sm leading-relaxed">{msg.message_text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-2">{timeStr}</p>
                    </div>
                  </div>
                );
              })}
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
                  ส่ง
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-background">
            <div className="text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}