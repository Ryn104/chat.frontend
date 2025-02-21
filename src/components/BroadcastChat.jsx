import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";

const GroupChat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [groupId, setGroupId] = useState(localStorage.getItem("GroupId"));
    const [groupName, setGroupName] = useState(localStorage.getItem("groupName") || "Unknown");
    const token = localStorage.getItem("authToken");

    const GroupId = localStorage.getItem("GroupId");
    const GroupName = localStorage.getItem("GroupName") || "Unknown";
    const GroupDescription = localStorage.getItem("GroupDescription") || "Unknown";
    const GroupImg = localStorage.getItem("GroupImg") || "Unknown";

    // let GroupMembers = [];
    // try {
    //     const membersData = localStorage.getItem("GroupMembers");
    //     GroupMembers = membersData ? JSON.parse(membersData) : []; 
        
    //     if (!Array.isArray(GroupMembers)) {
    //         GroupMembers = []; // Pastikan hasilnya array
    //     }
    // } catch (error) {
    //     console.error("Error parsing GroupMembers:", error);
    //     GroupMembers = [];
    // }

    const fetchUserData = async () => {
        try {
          const response = await fetch("http://api-chat.itclub5.my.id/api/user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("userId", data.id); // Simpan userId
          } else {
            console.error("Gagal mengambil data user:", response.status);
          }
        } catch (error) {
          console.error("Terjadi kesalahan saat mengambil data user:", error);
        }
      };
  
      // Panggil fungsi ini setelah login
      fetchUserData();
  
      const userId = localStorage.getItem("userId");
    

    useEffect(() => {
        if (!groupId) {
            setMessages([]);
            return;
        }

        const fetchGroupChat = async () => {
            try {
                const response = await fetch(
                    `http://api-chat.itclub5.my.id/api/chat/group/${GroupId}`,
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
                } else {
                    console.error("Gagal mengambil data chat grup:", response.status);
                }
            } catch (error) {
                console.error("Terjadi kesalahan saat mengambil data:", error);
            }
        };

        fetchGroupChat();
    }, [groupId]);

    useEffect(() => {
        const pusher = new Pusher("6cdc86054a25f0168d17", { cluster: "ap1" });
        const channel = pusher.subscribe("group-chat-channel");

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
                "http://api-chat.itclub5.my.id/api/chat/group/message",
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
                const sentMessage = await response.json();
                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setMessage("");
            } else {
                console.error("Gagal mengirim pesan:", response.status);
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    };

    const handleEdit = async (messageId, newText) => {
        if (!newText.trim()) return;
    
        try {
            const response = await fetch(
                `http://api-chat.itclub5.my.id/api/chat/message/${messageId}`,
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
                console.log("Pesan berhasil diedit:", data);
    
                // **Perbarui pesan di state tanpa perlu refresh**
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === messageId ? { ...msg, message_text: newText } : msg
                    )
                );
            } else {
                console.error("Gagal mengedit pesan:", response.status);
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat mengedit pesan:", error);
        }
    };
    
    
    const handleDelete = async (messageId) => {
        console.log("Deleting message ID:", messageId); // Debugging
    
        if (!messageId) {
            console.error("Message ID is undefined!");
            return;
        }
    
        try {
            const response = await fetch(
                `http://api-chat.itclub5.my.id/api/chat/message/${messageId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.ok) {
                console.log("Pesan berhasil dihapus:", messageId);
                
                // **Hapus pesan dari state langsung tanpa perlu refresh**
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.id !== messageId)
                );
            } else {
                console.error("Gagal menghapus pesan:", response.status);
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat menghapus pesan:", error);
        }
    };
    

    return (
        <div className="flex h-[110vh]">
            <div className="w-full flex-col justify-between">
                <div className="header w-full h-[10%] flex border-b border-gray-700">
                    <div className="kontak flex ml-8 py-8 gap-5 w-full">
                        <div className="flex items-center">
                            <img
                                className="w-[3.3vw] rounded-full"
                                src={GroupImg}
                                alt="profile"
                            />
                        </div>
                        <h1 className="font-semibold text-2xl">{GroupName}</h1>
                        {/* <h1 className="font-semibold text-2xl">{GroupMembers.length > 0
                            ? GroupMembers.map(member => member.name).join(", ")
                            : "No members"}</h1> */}
                    </div>
                </div>

                <div className="value-chat px-5 pt-8 h-[76%] overflow-y-auto">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <div key={index} className={`chat ${message.sender_id === parseInt(localStorage.getItem("userId")) ? "chat-end" : "chat-start"}`}>
                                <div className="chat-bubble max-w-[52%]">
                                    <strong>{message.sender.name}</strong>
                                    <p>{message.message_text}</p>
                                </div>
                                <div className="chat-footer opacity-50">
                                    <p>{message.date}</p>
                                    <p>{message.time}</p>
                                </div>
                                {message.sender_id ===
                parseInt(localStorage.getItem("userId")) && (
                <div className="opacity-100">
                  <p
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                      const newText = prompt(
                        "Edit pesan:",
                        message.message_text
                      );
                      if (newText !== null) {
                        handleEdit(message.id, newText);
                      }
                    }}
                  >
                    Edit
                  </p>
                  <p
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDelete(message.id)}
                  >
                    Delete
                  </p>
                  {message.is_read ? (
                    <p className="text-green-500">Seen</p>
                  ) : (
                    <p className="text-red-500">Unseen</p>
                  )}
                </div>
              )}
                            </div>
                        ))
                    ) : (
                        <p>No messages found</p>
                    )}
                </div>

                <div className="input-chat px-5 fixed xl:w-[74vw]">
                    <form onSubmit={sendMessage} className="input input-bordered flex items-center gap-2 w-full h-[45px]">
                        <input
                            type="text"
                            className="grow text-lg"
                            placeholder="Masukkan Pesan"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="">
                            <img src={photos.logo} alt="" className="w-10"/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GroupChat;
