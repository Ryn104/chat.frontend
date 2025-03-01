import React, { useEffect, useState, useCallback, useRef } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";

const BroadcastChat = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [messagesFetched, setMessagesFetched] = useState(false);
  const broadcastId = localStorage.getItem("BroadcastId");
  const token = localStorage.getItem("authToken");

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchBroadcastMessages = useCallback(async () => {
    if (!broadcastId || messagesFetched) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/chat/broadcast/${broadcastId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error(`HTTP status ${response.status}`);

      const data = await response.json();

      // Hindari duplikasi dengan Set
      const uniqueMessages = Array.from(
        new Map(
          data.map((msg) => [msg.created_at + msg.message_text, msg])
        ).values()
      );

      setMessages(
        uniqueMessages.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )
      );
      setMessagesFetched(true);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([{ message_text: "Error fetching messages." }]);
    }
  }, [broadcastId, token, messagesFetched]);

  useEffect(() => {
    fetchBroadcastMessages();
  }, [fetchBroadcastMessages]);

  useEffect(() => {
    if (!broadcastId) return;
  
    const pusher = new Pusher("6cdc86054a25f0168d17", {
      cluster: "ap1",
    });
  
    const channel = pusher.subscribe(`broadcast-chat-channel`);
  
    const handleNewMessage = (data) => {
      console.log("New message received from Pusher:", data);
      if (data.broadcast_id === broadcastId) {
        setMessages((prevMessages) => {
          const messagesSet = new Map(
            prevMessages.map((msg) => [msg.created_at + msg.message_text, msg])
          );
  
          if (!messagesSet.has(data.created_at + data.message_text)) {
            messagesSet.set(data.created_at + data.message_text, data);
          }
  
          return Array.from(messagesSet.values()).sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
        });
  
        scrollToBottom();
      }
    };
  
    channel.bind("broadcast-message-sent", handleNewMessage);
  
    return () => {
      channel.unbind("broadcast-message-sent", handleNewMessage);
      channel.unsubscribe();
    };
  }, [broadcastId]);
  

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      broadcast_id: broadcastId,
      message_text: message,
      created_at: new Date().toISOString(),
    };

    setMessages((prevMessages) => {
      const messagesSet = new Map(
        prevMessages.map((msg) => [msg.created_at + msg.message_text, msg])
      );

      messagesSet.set(
        newMessage.created_at + newMessage.message_text,
        newMessage
      );
      return Array.from(messagesSet.values()).sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    });

    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          broadcast_id: broadcastId,
          message_text: message,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");
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
        <div
          className="value-chat px-5 pt-8 h-[76%] overflow-y-auto"
          ref={messagesContainerRef}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="chat chat-start">
                <div className="chat-bubble max-w-[52%]">
                  <p>{msg.message_text}</p>
                </div>
                <div className="chat-footer opacity-50">
                  <p>
                    {new Date(msg.created_at).toISOString().split("T")[0]}
                    ,&nbsp;
                    {new Date(msg.created_at).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <p>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
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
