import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";
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
                const response = await fetch("http://api-chat.itclub5.my.id/api/contact", {
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
            <div className="flex">
                <div className="self-center xl:ml-6 z-40">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer" className="drawer-button"><img src={photos.logo} alt="" className="xl:w-10"/></label>
                    </div>
                    <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80">
                        {/* Sidebar content here */}
                        <div className=' flex xl:h-[100vh]'>
                        <div className='flex flex-col justify-between'>
                            <div className=''>
                            <div className="logo xl:my-4">
                                <div className="flex">
                                    <div className="img flex">
                                        <img src={photos.logo} alt="" className='self-center xl:w-8 mr-3'/>
                                    </div>
                                    <h1 className='xl:font-semibold xl:text-4xl'>Sent</h1>
                                </div>
                            </div>
                            <div className='flex justify-center mt-10'>
                                <button className="xl:w-[7vw]">
                                <div className='flex pl-1'>
                                    <img src={photos.privates} alt="" className='xl:h-[25px] self-center mr-2'/>
                                    <h1 className='xl:text-2xl self-center font-semibold'>Private</h1>
                                </div>
                                </button>
                            </div>
                            <div className='flex justify-center mt-10'>
                                <button className="xl:w-[7vw]">
                                <div className='flex pl-1'>
                                    <img src={photos.group} alt="" className='xl:h-[25px] self-center mr-2'/>
                                    <h1 className='xl:text-2xl self-center font-semibold'>Group</h1>
                                </div>
                                </button>
                            </div>
                            <div className='flex justify-center mt-10'>
                                <button className="xl:w-[7vw]">
                                <div className='flex pl-1'>
                                    <img src={photos.broadcast} alt="" className='xl:h-[25px] self-center mr-2'/>
                                    <h1 className='xl:text-2xl self-center font-semibold'>Broadcast</h1>
                                </div>
                                </button>
                            </div>
                            </div>
                            <div className='mb-5'>
                            <div className='flex justify-center mb-5'>
                                <button className="xl:w-[7vw]">
                                <div className='flex pl-1'>
                                    <img src={photos.setting} alt="" className='xl:h-[25px] self-center mr-2'/>
                                    <h1 className='xl:text-2xl self-center font-semibold'>Setting</h1>
                                </div>
                                </button>
                            </div>
                            <div className='flex justify-center'>
                                <img src={photos.Riyan} alt="" className='xl:w-16 rounded-full'/>
                                <h1 className='text-xl font-semibold ml-2 self-center'>Riyan Handriyana</h1>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                    </ul>
                    </div>
                </div>
                <h1 className="text-3xl font-semibold py-8 mx-5">Private Chat</h1>
            </div>
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
