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
            const url = "http://127.0.0.1:8000/api/contact";
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

const generateDefaultAvatar = (name) => {
  const words = name.split(" ");
  let avatarText = "";

  if (words.length >= 2) {
    // Take the first letter of the first two words
    avatarText = words[0].charAt(0) + words[1].charAt(0);
  } else if (words.length === 1) {
    // Take the first two letters of the single word
    avatarText = words[0].substring(0, 2);
  }

  return avatarText.toUpperCase(); // Convert to uppercase for consistency
};

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

   const renderRow = ({ user_id, name, img, divisi, kelas, email, last_online }) => {
    // Check if the img URL is the default one
    const isDefaultImg = img === "http://127.0.0.1:8000/storage";

    return (
      <tr
        key={user_id}
        className="w-full hover"
        onClick={() => {
          localStorage.setItem("receiverId", user_id); // Simpan ID ke localStorage
          localStorage.setItem("receiverName", name); // Simpan Nama ke localStorage
          localStorage.setItem("receiverDivisi", divisi); // Simpan Divisi ke localStorage
          localStorage.setItem("receiverImg", img); // Simpan Gambar ke localStorage
          localStorage.setItem("receiverEmail", email); // Simpan Gambar ke localStorage
          onSelectContact(user_id); // Panggil callback untuk tindakan lainnya
        }}
      >
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600">
                {isDefaultImg ? ( // Jika img adalah default, tampilkan default avatar
                  <div className="xl:w-[3.5vw] xl:h-[3.5vw] rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl">
                  {generateDefaultAvatar(name)}
                </div>
                ) : ( // Jika img bukan default, tampilkan gambar
                  <img src={img} alt={name} className="rounded-full" />
                )}
              </div>
            </div>
            <div className="tooltip tooltip-bottom" data-tip={name}>
              <div className="font-bold text-md xl:text-lg text-start">
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
  };

  if (loading) return <div>Loading...</div>; // Tampilkan loading jika sedang mengambil data
  if (error) return <div>Error: {error}</div>; // Tampilkan pesan error jika ada masalah

  return (
    <div className="xl:w-[22vw] w-[85.5vw] xl:border-gray-700 xl:border-r">
      <div className="flex">
        <div className="self-center xl:ml-6">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="drawer-button">
              <img src={photos.logo} alt="" className="w-10 ml-5" />
            </label>
          </div>
        </div>
        <h1 className="text-3xl font-semibold py-8 mx-5">Private Chat</h1>
      </div>
      <div className="flex justify-center px-5">
        <label className="input input-bordered flex items-center gap-2 w-full mr-3">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <img src={photos.adduser} className="w-6 xl:w-5" />
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
