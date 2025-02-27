import React, { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";

const GroupChat = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const groupId = localStorage.getItem("GroupId");
  const groupName = localStorage.getItem("GroupName") || "Unknown";
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

    const messagesContainerRef = useRef(null); // Reference to the message container
  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
      scrollToBottom(); // Scroll to bottom whenever messages change
    }, [messages]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.name);
          } else if (response.status === 429) {
            console.error("Rate limit exceeded. Please try again later.");
          } else {
            console.error("Failed to fetch user data:", response.status);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token, userId]);

  useEffect(() => {
    if (!groupId) {
      setMessages([]);
      return;
    }

    const fetchGroupChat = async (retries = 5, delay = 1000) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/chat/group/${groupId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else if (response.status === 429 && retries > 0) {
          console.warn("Rate limit exceeded. Retrying...");
          setTimeout(() => fetchGroupChat(retries - 1, delay * 2), delay);
        } else {
          console.error("Failed to fetch group chat:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchGroupChat();
  }, [groupId, token]);

  useEffect(() => {
    const pusher = new Pusher("6cdc86054a25f0168d17", { cluster: "ap1" });
    const channel = pusher.subscribe(`private-group-chat.${groupId}`);


    const handleNewMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    channel.bind("group-message-sent", handleNewMessage);

    return () => {
      channel.unbind("group-message-sent", handleNewMessage);
      channel.unsubscribe();
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      group_id: groupId,
      message_text: message,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chat/group/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMessage),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const sentMessage = {
          ...result.data.chat,
          sender: {
            id: parseInt(userId),
            name: result.data.user_name || "Unknown User", // Default jika null
          },
        };
        

        setMessages((prevMessages) => [...prevMessages, sentMessage]);
        setMessage("");
      } else if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After") || 1;
        console.error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
        setTimeout(() => sendMessage(e), retryAfter * 1000);
      } else {
        console.error("Failed to send message:", response.status);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEdit = async (messageId, newText) => {
    if (!newText.trim()) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/chat/message/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message_text: newText }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, message_text: newText } : msg
          )
        );
      } else {
        console.error("Failed to edit message:", response.status);
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleDelete = async (messageId) => {
    if (!messageId) {
      console.error("Message ID is undefined!");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/chat/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageId)
        );
      } else {
        console.error("Failed to delete message:", response.status);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="flex xl:h-[110vh] h-[112vh] xl:w-full w-[85.7vw]">
      <div className="w-full flex-col justify-between">
        <div className="header w-full h-[8%] xl:h-[10%] flex border-b border-gray-700">
          <div className="kontak flex xl:ml-8 ml-4 py-5 xl:py-8 gap-5 w-full">
            <button onClick={onBack}>
              <img src={photos.back} alt="Back" className="w-10" />
            </button>
            <div className="flex items-center">
              <img
                className="w-12 xl:w-[3.3vw] rounded-full"
                src={localStorage.getItem("GroupImg") || "Unknown"}
                alt="profile"
              />
            </div>
            <h1 className="font-semibold text-2xl">{groupName}</h1>
          </div>
        </div>

        <div className="value-chat px-5 pt-8 h-[76%] overflow-y-auto"
          ref={messagesContainerRef} >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${
                message.sender_id === parseInt(userId) ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-bubble max-w-[52%]">
                <strong>{message.sender?.name || "Unknown User"}</strong>
                <p>{message.message_text}</p>
              </div>
              <div className="chat-footer opacity-50">
                <p>{message.date}</p>
                <p>{message.time}</p>
              </div>
              {message.sender_id === parseInt(userId) && (
                <div className="opacity-100">
                  <p
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                      const newText = prompt("Edit pesan:", message.message_text);
                      if (newText !== null) handleEdit(message.id, newText);
                    }}
                  >
                    <img src={photos.edit} alt="" className="w-4 mb-2" />
                  </p>
                  <p
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDelete(message.id)}
                  >
                    <img src={photos.dellete} alt="" className="w-4 mb-2" />
                  </p>
                  {message.is_read ? (
                    <img src={photos.ceklist1} alt="" className="w-4" />
                  ) : (
                    <img src={photos.ceklist2} alt="" className="w-4" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

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

export default GroupChat;