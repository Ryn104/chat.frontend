import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";

const GroupChat = ({ groupId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [groupName, setGroupName] = useState("Group Chat");

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!groupId) return;

        const fetchGroupMessages = async () => {
            try {
                const response = await fetch(`http://api-chat.itclub5.my.id/api/group/${groupId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error("Failed to load group messages");
                }
            } catch (error) {
                console.error("Error fetching group messages:", error);
            }
        };

        fetchGroupMessages();

        const pusher = new Pusher("6cdc86054a25f0168d17", { cluster: "ap1" });
        const channel = pusher.subscribe(`group-chat-${groupId}`);
        channel.bind("message-sent", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [groupId, token]);

    const submit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            group_id: groupId,
            message_text: message,
        };

        try {
            const response = await fetch("http://api-chat.itclub5.my.id/api/group/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newMessage),
            });

            if (response.ok) {
                setMessage(""); // Reset input after sending
            } else {
                console.error("Failed to send group message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="w-full flex-col h-[100vh]">
            {/* Group Header */}
            <div className="header w-full h-[10%] flex border-b border-gray-700">
                <div className="kontak flex py-3 px-9 justify-between w-full">
                    <div className="flex gap-3">
                        <div className="flex items-center">
                            <img
                                className="w-[3.3vw] rounded-full"
                                src={photos.group}
                                alt="group"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="font-semibold text-2xl">{groupName}</h1>
                            <p className="text-lg">Group Chat</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Group Chat Messages */}
            <div className="value-chat px-5 pt-8 h-[76%] overflow-y-auto">
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`chat ${msg.sender_id === parseInt(localStorage.getItem("userId")) ? "chat-end" : "chat-start"}`}>
                            <div className="chat-bubble max-w-[52%]">
                                <strong>{msg.sender_name}</strong>
                                <p>{msg.message_text}</p>
                            </div>
                            <div className="chat-footer opacity-50">
                                <p>{msg.date}</p>
                                <p>{msg.time}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No messages found</p>
                )}
            </div>

            {/* Input Message */}
            <div className="input-chat px-5 fixed xl:w-[82%]">
                <form onSubmit={submit} className="input input-bordered flex items-center gap-2 w-full h-[45px]">
                    <input
                        type="text"
                        className="grow text-lg"
                        placeholder="Enter message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupChat;
    