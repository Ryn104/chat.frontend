import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";

const BroadcastChat = ({onBack}) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [broadcastId, setBroadcastId] = useState(localStorage.getItem("BroadcastId"));
    const [broadcastMessage, setBroadcastMessage] = useState(localStorage.getItem("BroadcastMessage") || "Unknown");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!broadcastId) {
            setMessages([]);
            return;
        }

        const fetchBroadcastMessages = async () => {
            try {
                const response = await fetch(
                    `http://api-chat.itclub5.my.id/api/chat/broadcast`,
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
                    console.log("berhasil")
                } else {
                    console.error("Gagal mengambil data chat broadcast:", response.status);
                }
            } catch (error) {
                console.error("Terjadi kesalahan saat mengambil data:", error);
            }
        };

        fetchBroadcastMessages();
    }, [broadcastId]);

    useEffect(() => {
        const pusher = new Pusher("6cdc86054a25f0168d17", { cluster: "ap1" });
        const channel = pusher.subscribe("broadcast-chat-channel");

        const handleNewMessage = (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        channel.bind("broadcast-message-sent", handleNewMessage);

        return () => {
            channel.unbind("broadcast-message-sent", handleNewMessage);
            channel.unsubscribe();
        };
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            broadcast_id: broadcastId,
            message_text: message,
        };

        try {
            const response = await fetch(
                "http://api-chat.itclub5.my.id/api/chat/broadcast",
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
                localStorage.setItem("message_broadcast", newMessage.message_text)
            } else {
                console.error("Gagal mengirim pesan:", response.status);
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    };

    return (
        <div className="flex xl:h-[110vh] h-[107vh] xl:w-full w-[85.7vw]">
            <div className="w-full flex-col justify-between">
                <div className="header w-full h-[10%] flex border-b border-gray-700">
                <button className="" onClick={onBack}>
                            <img src={photos.back} alt="Back" className="w-10 ml-5" />
                        </button>
                    <div className="kontak flex ml-8 py-8 gap-5 w-full">
                        <h1 className="font-semibold text-2xl">Broadcast Chat</h1>
                    </div>
                </div>

                

                <div className="value-chat px-5 pt-8 h-[76%] overflow-y-auto">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <div key={index} className={`chat chat-start`}>
                                <div className="chat-bubble max-w-[52%]">
                                    <p>{localStorage.getItem("message_broadcast")}</p>
                                </div>
                                <div className="chat-footer opacity-50">
                                    <p>{new Date(message.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="chat-bubble max-w-[52%]">
                                    <p>{localStorage.getItem("message_broadcast")}</p>
                        </div>
                    )}
                </div>

                <div className="input-chat px-4 fixed xl:w-[74vw] w-[85vw]">
                    <form onSubmit={sendMessage} className="input input-bordered flex items-center gap-2 w-full xl:h-[45px] h-[4.5vh]">
                        <input
                            type="text"
                            className="grow text-lg"
                            placeholder="Masukkan Pesan"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="">
                            <img src={photos.logo} alt="" className="xl:w-10 w-6"/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BroadcastChat;
