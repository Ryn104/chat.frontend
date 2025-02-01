import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";

const GroupChat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [groupId, setGroupId] = useState(localStorage.getItem("groupId"));
    const [groupName, setGroupName] = useState(localStorage.getItem("groupName") || "Unknown");
    const token = localStorage.getItem("authToken");

    const GroupId = localStorage.getItem("GroupId");
    const GroupName = localStorage.getItem("GroupName") || "Unknown";
    const GroupDescription = localStorage.getItem("GroupDescription") || "Unknown";
    const GroupMembers = localStorage.getItem("GroupMembers") || "Unknown";
    
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

    return (
        <div className="flex h-[110vh]">
            <div className="w-full flex-col justify-between">
                <div className="header w-full h-[10%] flex border-b border-gray-700">
                    <div className="kontak flex py-3 px-9 justify-between w-full">
                        <h1 className="font-semibold text-2xl">{GroupName}</h1>
                    </div>
                </div>

                <div className="value-chat px-5 pt-8 h-[76%] overflow-y-auto">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <div key={index} className={`chat ${message.sender_id === parseInt(localStorage.getItem("userId")) ? "chat-end" : "chat-start"}`}>
                                <div className="chat-bubble max-w-[52%]">
                                    <strong>{message.sender_name}</strong>
                                    <p>{message.message_text}</p>
                                </div>
                                <div className="chat-footer opacity-50">
                                    <p>{message.date}</p>
                                    <p>{message.time}</p>
                                </div>
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
                        <button type="submit" className="btn btn-primary">Kirim</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GroupChat;
