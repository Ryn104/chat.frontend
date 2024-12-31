import React, { useState } from "react";
import chatData from "../assets/chatData"; // Import chatData yang berisi daftar chat
import photos from "../assets/image.js";
import './Kontak.css';

const Kontak = ({ onSelectContact }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Fungsi untuk mencari semua pesan dari setiap kontak
    const searchMessages = (contact) => {
        const chatHistory = chatData[contact];
        const filteredMessages = chatHistory.filter(({ message }) =>
            message.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return filteredMessages;
    };

    // Ambil pesan terakhir dari setiap kontak
    const messages = Object.keys(chatData).map(contact => {
        const lastMessage = chatData[contact][chatData[contact].length - 1];
        const searchResults = searchMessages(contact); // Cari chat yang cocok dengan query
        const isHighlighted = searchResults.length > 0; // Apakah ada pesan yang cocok

        return {
            id: contact,
            name: contact,
            message: lastMessage.message,
            time: lastMessage.time, // Tambahkan waktu pesan terakhir
            imgSrc: photos[contact], // Ambil foto dari objek photos
            isHighlighted,
        };
    });

    const highlightText = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={index} style={{ color: "white", fontWeight: "bold" }}>{part}</span>
            ) : (
                part
            )
        );
    };

    // Filter hanya kontak yang punya hasil pencarian, atau tampilkan semua jika query kosong
    const filteredMessages = messages.filter(({ name, message, isHighlighted }) =>
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        isHighlighted
    );

    const renderRow = ({ id, name, message, imgSrc, time }) => (
        <tr key={id} className="w-full hover" onClick={() => onSelectContact(id)}>
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="rounded-full border border-gray-900 h-20 w-20">
                            <img src={imgSrc} alt={name} />
                        </div>
                    </div>
                    {/* Tooltip hanya menampilkan pesan terakhir */}
                    <div className="tooltip tooltip-bottom" data-tip={message}>
                        <div className="font-bold text-lg text-start">
                            {highlightText(name, searchQuery)}
                        </div>
                        <div className="message-text opacity-50 text-lg truncate w-[14.5vcd w] text-start">
                            {highlightText(message, searchQuery)} - <span className="time">{time}</span>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );



    return (
        <div className="w-[22vw] border-gray-700 border-r">
            <h1 className="text-3xl font-semibold py-8 mx-10">Private Chat</h1>
            <div className="flex justify-center px-5">
                <label className="input input-bordered flex items-center gap-2 w-full">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </label>
            </div>
            <div className="overflow-x-hidden mt-8 h-[85vh]">
                <table className="table">
                    <tbody>
                        {filteredMessages.map(renderRow)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Kontak;
