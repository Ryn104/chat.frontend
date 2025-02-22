import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";
import "./Kontak.css";

const GroupKontak = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("http://api-chat.itclub5.my.id/api/group-contacts", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token]);

  const filteredGroups = groups.filter(
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
    group_id,
    name,
    description,
    members,
    img,
  }) => (
    <tr
      key={group_id} // Sesuaikan key untuk kontak pribadi atau grup
      className="w-full hover"
      onClick={() => {
        localStorage.setItem("GroupId", group_id); // Simpan ID ke localStorage
        localStorage.setItem("GroupName", name); // Simpan Nama ke loca  lStorage
        localStorage.setItem("GroupDescription", description); // Simpan Divisi ke localStorage
        localStorage.setItem("GroupMembers", members); // Simpan Divisi ke localStorage
        localStorage.setItem("GroupImg", img); // Simpan Divisi ke localStorage
        onSelectGroup(group_id); // Panggil callback untuk tindakan lainnya
      }}
    >
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="rounded-full border border-gray-700 h-16 w-16 xl:h-20 xl:w-20">
              <img
                src={img} // Gunakan gambar default jika avatar null
                alt={name}
              />
            </div>
          </div>
          <div className="tooltip tooltip-bottom" data-tip={name}>
            <div className="font-bold text-md xl:text-lg text-start">
              {highlightText(name, searchQuery)}
            </div>
            <div className="text-gray-400 text-sm text-start">
              Division: {highlightText(description, searchQuery)}
            </div>
            <div className="text-gray-400 text-sm text-start">
              Class: {highlightText(members.name, searchQuery)}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="xl:w-[22vw] w-[85.5vw] xl:border-gray-700 xl:border-r">
      <div className="flex">
        <div className="self-center xl:ml-6">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer" className="drawer-button">
              <img src={photos.logo} alt="" className="w-10 ml-5" />
            </label>
          </div>
          </div>
        <h1 className="text-3xl font-semibold py-8 mx-5">
          Group Chat
        </h1>
        {/* Teks berubah */}
      </div>
      <div className="flex justify-center px-5">
        <input
          type="text"
          className="input input-bordered w-full mr-3"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
                <button
          className="btn"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <img
            src={photos.addgroup}
            className="w-6 xl:w-5"
            onClick={() => setIsGroup(false)}
          />
        </button>
      </div>
      
      <div className="overflow-x-hidden mt-8 h-[85vh]">
        <table className="table">
          <tbody>{filteredGroups.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupKontak;
