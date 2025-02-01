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
  }) => (
    <tr
      key={group_id} // Sesuaikan key untuk kontak pribadi atau grup
      className="w-full hover"
      onClick={() => {
        localStorage.setItem("GroupId", group_id); // Simpan ID ke localStorage
        localStorage.setItem("GroupName", name); // Simpan Nama ke loca  lStorage
        localStorage.setItem("GroupDescription", description); // Simpan Divisi ke localStorage
        localStorage.setItem("GroupMembers", members); // Simpan Divisi ke localStorage
        onSelectGroup(group_id); // Panggil callback untuk tindakan lainnya
      }}
    >
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="rounded-full border border-gray-900 h-20 w-20">
              <img
                src={photos.Riyan} // Gunakan gambar default jika avatar null
                alt={name}
              />
            </div>
          </div>
          <div className="tooltip tooltip-bottom" data-tip={name}>
            <div className="font-bold text-lg text-start">
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
    <div className="w-[22vw] border-gray-700 border-r">
      <h1 className="text-3xl font-semibold py-8 mx-5">Group Chat</h1>
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
            className="xl:w-5"
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
