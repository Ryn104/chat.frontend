import React, { useEffect, useState, useCallback, useRef } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";



// Custom Hook untuk Pusher
const usePusher = (broadcastId, onNewMessage) => {
  useEffect(() => {
    if (!broadcastId) return;

    const pusher = new Pusher("6cdc86054a25f0168d17", { cluster: "ap1" });
    const channel = pusher.subscribe(`broadcast-chat-channel-${broadcastId}`);

    channel.bind("broadcast-message-sent", onNewMessage);

    return () => {
      channel.unbind("broadcast-message-sent", onNewMessage);
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [broadcastId, onNewMessage]);
};

const BroadcastChat = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const broadcastId = localStorage.getItem("BroadcastId");
  const token = localStorage.getItem("authToken");

  const messagesContainerRef = useRef(null); // Reference to the message container
  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
      scrollToBottom(); // Scroll to bottom whenever messages change
    }, [messages]);

  // Fetch Pesan Broadcast
  const fetchBroadcastMessages = useCallback(async () => {
    if (!broadcastId) return;
    
    try {
      const response = await fetch(
        `http://api-chat.itclub5.my.id/api/chat/broadcast/${broadcastId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error(`HTTP status ${response.status}`);

      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([{ message_text: "Failed to load messages." }]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([{ message_text: "Error fetching messages. Check your connection." }]);
    }
  }, [broadcastId, token]);

  // Update pesan saat ada perubahan broadcastId
  useEffect(() => {
    fetchBroadcastMessages();
  }, [broadcastId, fetchBroadcastMessages]);

  // Handle Pesan Baru dari Pusher
  const handleNewMessage = useCallback(
    (newMessage) => {
      if (newMessage.broadcast_id === broadcastId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    },
    [broadcastId]
  );

  usePusher(broadcastId, handleNewMessage);

  // Kirim Pesan
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      broadcast_id: broadcastId,
      message_text: message,
      created_at: new Date().toISOString(), // Optimistic UI
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]); // Optimistic UI
    setMessage(""); // Kosongkan input

    try {
      const response = await fetch(
        "http://api-chat.itclub5.my.id/api/chat/broadcast",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ broadcast_id: broadcastId, message_text: message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please check your connection.");
    }
  };

  return (
    <div className="flex xl:h-[110vh] h-[107vh] xl:w-full w-[85.7vw]">
      <div className="w-full flex-col justify-between">
        {/* Header */}
        <div className="header w-full h-[10%] flex border-b border-gray-700">
          <button onClick={onBack}>
            <img src={photos.back} alt="Back" className="w-10 ml-5" />
          </button>
          <div className="kontak flex ml-8 py-8 gap-5 w-full">
            <h1 className="font-semibold text-2xl">Broadcast Chat</h1>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="value-chat px-5 pt-8 h-[76%] overflow-y-auto"
        ref={messagesContainerRef}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="chat chat-start">
                <div className="chat-bubble max-w-[52%]">
                  <p>{msg.message_text}</p>
                </div>
                <div className="chat-footer opacity-50">
                  <p>{new Date(msg.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="chat-bubble max-w-[52%]">
              <p>No messages yet</p>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="input-chat px-4 fixed xl:w-[74vw] w-[85vw]">
          <form
            onSubmit={sendMessage}
            className="input input-bordered flex items-center gap-2 w-full xl:h-[45px] h-[4.5vh]"
          >
            <input
              type="text"
              className="grow text-lg"
              placeholder="Masukkan Pesan"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">
              <img src={photos.logo} alt="" className="xl:w-10 w-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BroadcastChat;
