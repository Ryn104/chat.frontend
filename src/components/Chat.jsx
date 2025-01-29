import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState(""); // Nama pengirim saat ini

    const token = localStorage.getItem("authToken");
    const receiverId = localStorage.getItem("receiverId");
    const receiverName = localStorage.getItem("receiverName") || "Unknown";
    const receiverDivisi = localStorage.getItem("receiverDivisi") || "Unknown";

    useEffect(() => {
        if (!receiverId) {
            alert("Pilih kontak terlebih dahulu!");
            return;
        }

        const fetchChatData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/chat/${receiverId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log("Data dari API:", data);

                    // Langsung simpan data pesan ke state
                    setMessages(data);
                } else {
                    console.error("Gagal mengambil data chat:", response.status);
                }
            } catch (error) {
                console.error("Terjadi kesalahan saat mengambil data:", error);
            }
        };

        fetchChatData();
    }, [token, receiverId]);

    useEffect(() => {
        const pusher = new Pusher("6cdc86054a25f0168d17", {
            cluster: "ap1",
        });

        const channel = pusher.subscribe("chat-channel");
        channel.bind("message-sent", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        const newMessage = {
            receiver_id: receiverId,
            message_text: message,
        };

        try {
            
            const response = await fetch(
                "http://127.0.0.1:8000/api/chat/",
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
                const sname = await response.json(); // Get the response data
                
                setUsername(sname.sender_name);

                console.log("Pesan berhasil dikirim!");
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        sender_id: parseInt(localStorage.getItem("userId")),
                        sender_name: sname.sender_name,
                        receiver_id: parseInt(receiverId),
                        receiver_name: receiverName,
                        message_text: message,
                        time: new Date().toLocaleTimeString(),
                        date: new Date().toLocaleDateString(),
                        is_read: null,
                    },
                ]);
                setMessage("");
            } else {
                console.error("Gagal mengirim pesan:", response.status);
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    };

    return (
        <div className="w-full flex-col justify-between h-[110vh]">
            {/* Header */}
            <div className="header w-full h-[10%] flex border-b border-gray-700">
                <div className="kontak flex py-3 px-9 justify-between w-full">
                    <div className="flex gap-3">
                        <div className="flex items-center">
                            <img
                                className="w-[3.3vw] rounded-full"
                                src={photos[receiverId]}
                                alt="profile"
                                onError={(e) => (e.target.src = "fallback-image-url")}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="font-semibold text-2xl">
                                {receiverName}
                            </h1>
                            <p className="text-lg">{receiverDivisi}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="value-chat px-5 pt-8 h-[76%] overflow-y-auto">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat ${
                                message.sender_id ===
                                parseInt(localStorage.getItem("userId"))
                                    ? "chat-end"
                                    : "chat-start"
                            }`}
                        >
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

            {/* Input Chat */}
            <div className="input-chat px-5 fixed xl:w-[74%]">
                <form
                    onSubmit={submit}
                    className="input input-bordered flex items-center gap-2 w-full h-[45px]"
                >
                    <input
                        type="text"
                        className="grow text-lg "
                        placeholder="Masukkan Pesan"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Kirim
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
