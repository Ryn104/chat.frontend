import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("Nun"); // Nama pengirim saat ini (sesuaikan)

    const receiverId = 5; // ID penerima yang tetap

    // Ambil token dari localStorage
    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const response = await fetch(`http://api-chat.itclub5.my.id/api/chat`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`, // Kirim token di header
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Data dari API:", data); // Debugging: lihat data yang diterima
                    
                    // Ambil semua pesan antara sender dan receiver yang relevan
                    const allMessages = data.flatMap(chat => 
                        chat.messages.filter(message => 
                            (message.sender_id === 1 && message.receiver_id === receiverId) || 
                            (message.sender_id === receiverId && message.receiver_id === 1)
                        )
                    );

                    setMessages(allMessages); // Set data pesan ke state
                } else {
                    console.error("Gagal mengambil data chat");
                }
            } catch (error) {
                console.error("Terjadi kesalahan saat mengambil data:", error);
            }
        };

        fetchChatData();
    }, [token, receiverId]);

    // Mengatur koneksi Pusher
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

    // Fungsi untuk mengirim pesan
    const submit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return; // Cek jika pesan kosong

        const newMessage = {
            receiver_id: receiverId, // ID penerima
            message_text: message,
        };

        try {
            const response = await fetch("http://api-chat.itclub5.my.id/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Kirim token di header
                },
                body: JSON.stringify(newMessage),
            });

            if (response.ok) {
                console.log("Pesan berhasil dikirim!");
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        username: username,
                        message_text: message,
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                setMessage(""); // Reset pesan setelah berhasil dikirim
            } else {
                console.error("Gagal mengirim pesan:", response.status);
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="header w-full h-[10%] flex border-b border-gray-700">
                <div className="kontak flex py-3 px-9 justify-between w-full">
                    <div className="flex gap-3">
                        <div className="flex items-center">
                            <img
                                className="w-[3.3vw] rounded-full"
                                src={photos[receiverId]}
                                alt={receiverId}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="font-semibold text-2xl">Riyan</h1>
                            <p className="text-lg">Terakhir online beberapa waktu lalu.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daftar Chat */}
            <div className="value-chat px-5 pt-8 h-[83%] overflow-y-auto">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat ${message.sender_id === 1 ? "chat-end" : "chat-start"}`}
                        >
                            <div className="chat-bubble max-w-[52%]">
                                <strong>{message.sender_name}</strong>: <p>{message.message_text}</p>
                            </div>
                            <div className="chat-footer opacity-50">{message.time}</div>
                        </div>
                    ))
                ) : (
                    <p>No messages found</p> // Menampilkan pesan jika tidak ada data
                )}
            </div>

            {/* Input Chat */}
            <div className="input-chat px-5">
                <form
                    onSubmit={submit}
                    className="input input-bordered flex items-center gap-2 w-full h-[45px]"
                    method="post"
                >
                    <input
                        type="text"
                        className="grow text-lg"
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
