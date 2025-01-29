import React, { useState, useEffect } from "react";
import './Kontak.css';

const Kontak = ({ onSelectContact }) => {
    const [contacts, setContacts] = useState([]); // Menyimpan data kontak
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true); // Status loading
    const [error, setError] = useState(null); // Status error
    const token = localStorage.getItem("authToken");
    // Fetch data dari API saat komponen dimuat
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/contact", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`, // Kirim token di header
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json(); 
                setContacts(data); // Simpan data API ke state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Selesai loading
            }
        };

        fetchContacts();
    }, []);

    

    // Filter kontak berdasarkan pencarian
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.divisi && contact.divisi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (contact.kelas && contact.kelas.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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

    const renderRow = ({ user_id, name, avatar, divisi, kelas, last_online }) => (
        <tr
            key={user_id}
            className="w-full hover"
            onClick={() => {
                localStorage.setItem("receiverId", user_id); // Simpan ID ke localStorage
                localStorage.setItem("receiverName", name); // Simpan ID ke localStorage
                localStorage.setItem("receiverDivisi", divisi); // Simpan Divisi ke localStorage
                onSelectContact(user_id); // Panggil callback untuk tindakan lainnya
            }}
        >
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="rounded-full border border-gray-900 h-20 w-20">
                            <img
                                src={avatar || "default-image.jpg"} // Gunakan gambar default jika avatar null
                                alt={name}
                            />
                        </div>
                    </div>
                    <div className="tooltip tooltip-bottom" data-tip={name}>
                        <div className="font-bold text-lg text-start">
                            {highlightText(name, searchQuery)}
                        </div>
                        <div className="text-gray-400 text-sm text-start">
                            Divisi: {highlightText(divisi || "Tidak ada divisi", searchQuery)}
                        </div>
                        <div className="text-gray-400 text-sm text-start">
                            Kelas: {highlightText(kelas || "Tidak ada kelas", searchQuery)}
                        </div>
                        <div className="text-gray-500 text-xs text-start">
                            Last Online: {last_online || "Unknown"}
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );    

    if (loading) return <div>Loading...</div>; // Tampilkan loading jika sedang mengambil data
    if (error) return <div>Error: {error}</div>; // Tampilkan pesan error jika ada masalah

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
                        {filteredContacts.map(renderRow)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Kontak;
