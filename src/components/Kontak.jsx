import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";
import "./Kontak.css";

const Kontak = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState([]); // Menyimpan data kontak
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Status loading
  const [error, setError] = useState(null); // Status errorgrup
  const token = localStorage.getItem("authToken");

  // Fetch data berdasarkan mode (Private atau Group)
  useEffect(() => {
    const fetchContacts = async () => {
        try {
            const url = "http://api-chat.itclub5.my.id/api/contact";
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setContacts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchContacts();
}, [token]); // Re-fetch ketika mode (isGroup) berubah

  // Filter kontak berdasarkan pencarian
  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.name &&
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.divisi &&
        contact.divisi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.kelas &&
        contact.kelas.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ color: "white", fontWeight: "bold" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderRow = ({
    user_id,
    name,
    img,
    divisi,
    kelas,
    last_online,
  }) => (
    <tr
      key={user_id} // Sesuaikan key untuk kontak pribadi atau grup
      className="w-full hover"
      onClick={() => {
        localStorage.setItem("receiverId", user_id); // Simpan ID ke localStorage
        localStorage.setItem("receiverName", name); // Simpan Nama ke loca  lStorage
        localStorage.setItem("receiverDivisi", divisi); // Simpan Divisi ke localStorage
        localStorage.setItem("receiverImg", img); // Simpan Divisi ke localStorage
        onSelectContact(user_id); // Panggil callback untuk tindakan lainnya
      }}
    >
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="rounded-full border border-gray-900 h-20 w-20">
              <img
                src={img} // Gunakan gambar default jika avatar null
                alt={name}
              />
            </div>
          </div>
          <div className="tooltip tooltip-bottom" data-tip={name}>
            <div className="font-bold text-lg text-start">
              {highlightText(name, searchQuery)}
            </div>
            <div className="text-gray-400 text-sm text-start">
              Division: {highlightText(divisi, searchQuery)}
            </div>
            <div className="text-gray-400 text-sm text-start">
              Class: {highlightText(kelas, searchQuery)}
            </div>
            <div className="text-gray-500 text-xs text-start">
              Last Online: {last_online}
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
        <div className="self-center xl:ml-6">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer" className="drawer-button">
              <img src={photos.logo} alt="" className="xl:w-10" />
            </label>
          </div>
          </div>
        <h1 className="text-3xl font-semibold py-8 mx-5">
          Private Chat
        </h1>
        {/* Teks berubah */}
      </div>
      <div className="flex justify-center px-5">
        <label className="input input-bordered flex items-center gap-2 w-full mr-3">
          <input
            type="text"
            className="grow "
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <img
            src={photos.adduser}
            className="xl:w-5"
            onClick={() => setIsGroup(false)}
          />
        </button>
      </div>
      <div className="overflow-x-hidden mt-8 h-[85vh]">
        <table className="table">
          <tbody>{filteredContacts.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Kontak;
