import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";

const Chat = ({ contactId, chatData }) => {
    const [username, setUsername] = useState("username");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const chats = chatData[contactId] || [];

    // Mengatur koneksi Pusher
    useEffect(() => {
        Pusher.logToConsole = true;

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

        try {
            const response = await fetch("http://192.168.105.1:8000/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, messages }),
            });

            if (response.ok) {
                console.log("Pesan berhasil dikirim!");
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
                                src={photos[contactId]}
                                alt={contactId}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <input
                                type="text"
                                className="grow text-lg"
                                placeholder="Masukkan Nama"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <h1 className="font-semibold text-2xl">{contactId}</h1>
                            <p className="text-lg">Terakhir online beberapa waktu lalu.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daftar Chat */}
            <div className="value-chat px-5 pt-8 h-[83%] overflow-y-auto">
                {chats.map((chat, index) => {
                    const nextChat = chats[index + 1];
                    const shouldShowTime = !nextChat || nextChat.time !== chat.time;

                    return (
                        <div
                            key={index}
                            className={`chat ${
                                chat.sender === "Anda" ? "chat-end" : "chat-start"
                            }`}
                        >
                            <div className="chat-bubble max-w-[52%]">{chat.message}</div>
                            {shouldShowTime && (
                                <div className="chat-footer opacity-50">{chat.time}</div>
                            )}
                        </div>
                    );
                })}
                {messages.map((message, index) => (
                    <div key={index} className="chat chat-start">
                        <div className="chat-bubble max-w-[52%]">
                            <strong>{message.username}</strong>: <p>{message.messages}</p> 
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Chat */}
            <div className="input-chat px-5">
                <form
                    onSubmit={submit}
                    className="input input-bordered flex items-center gap-2 w-full h-[45px]"
                    method="post">
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



// import React from "react";
// import photos from "../assets/image.js";
// import { useEffect, useState } from "react";
// import Pusher from "pusher-js";

// const Chat = ({ contactId, chatData }) => {
//     const chats = chatData[contactId] || [];

// const [username, setUsername] = useState('username');
// const [messages, setMessages] = useState([]);
// const [message, setMessage] = useState('');
// let allMessages = [];

// useEffect( () => {
//     Pusher.logToConsole = true;

//     const pusher = new Pusher('6cdc86054a25f0168d17', {
//       cluster: 'ap1'
//     });

//     const channel = pusher.subscribe('chat-channel');
//     channel.bind('message-sent', function(data) {
//       allMessages.push(data);
//       setMessages(allMessages);
//     });
// }, []);

// const submit = async (e) => {
//     e.preventDefault(); // Mencegah reload halaman

//     try {
//         const response = await fetch('http://127.0.0.1:8000/api/messages', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' }, // Perbaikan typo
//             body: JSON.stringify({ username, message }),
//         });

//         if (response.ok) {
//             console.log("Pesan berhasil dikirim!");
//             setMessage(''); // Reset pesan setelah berhasil dikirim
//         } else {
//             console.error("Gagal mengirim pesan:", response.status);
//         }
//     } catch (error) {
//         console.error("Terjadi kesalahan:", error);
//     }
// };

//     return (
//         <div className="w-full">
//             <div className="header w-full h-[10%] flex border-b border-gray-700">
//                 <div className="kontak flex py-3 px-9 justify-between w-full">
//                     <div className="flex gap-3">
//                         <div className="flex items-center">
//                             <img className="w-[3.3vw] rounded-full" src={photos[contactId]} alt={contactId} />
//                         </div>
//                         <div className="flex flex-col justify-center">
//                             <input type="text" className="grow text-lg" placeholder="Mesukan Pesan" value={username} onChange={e => setUsername(e.target.value)}/>  
//                             <h1 className="font-semibold text-2xl">{contactId}</h1>
//                             <p className="text-lg">Terakhir online beberapa waktu lalu.</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="value-chat px-5 pt-8 h-[83%] overflow-y-auto">
//                 {chats.map((chat, index) => {
//                     const nextChat = chats[index + 1];
//                     const shouldShowTime = !nextChat || nextChat.time !== chat.time; // Menampilkan waktu hanya jika pesan berikutnya berbeda atau tidak ada

//                     return (
//                         <div key={index} className={`chat ${chat.sender === "Anda" ? "chat-end" : "chat-start"}`}>
//                             <div className="chat-bubble max-w-[52%]">{chat.message}</div>
//                             {shouldShowTime && <div className="chat-footer opacity-50">{chat.time}</div>}
//                         </div>
//                     );
//                 })}
//                 {messages.map(message => {
//                     return (
//                         <div>
//                             <div className="chat-bubble max-w-[52%]">
//                                 <div>
//                                     {message.username}
//                                 </div>
//                                 <div>
//                                     {message.message}
//                                 </div>
//                             </div>
//                         </div>
//                     )
//                 })}
//             </div>
//             <div className="input-chat px-5">
//                 <label className="input input-bordered flex items-center gap-2 w-full h-[45px]">
//                     <form onSubmit={e => submit(e)}>
//                         <input type="text" className="grow text-lg" placeholder="Mesukan Pesan" value={message} onChange={e => setMessage(e.target.value)}/>
//                     </form>
//                 </label>
//             </div>
//         </div>
//     );
// };

// export default Chat;
