import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";
import "./Kontak.css";

const GroupKontak = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [creating, setCreating] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://api-chat.itclub5.my.id/api/contact", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await fetch("http://api-chat.itclub5.my.id/api/group-contacts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
    fetchGroups();
  }, [token]);

  const handleSelectRecipient = (userId) => {
    setSelectedRecipients((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient.");
      return;
    }
    
    setCreating(true);
    try {
      const response = await fetch("http://api-chat.itclub5.my.id/api/chat/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipient_ids: selectedRecipients }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const newGroup = await response.json();
      setGroups((prev) => [newGroup, ...prev]);
      setSelectedRecipients([]);
      document.getElementById("my_modal_3").close();
    } catch (err) {
      alert("Error creating group: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-[22vw] border-gray-700 border-r">
      <div className="flex">
        <h1 className="text-3xl font-semibold py-8 mx-5">Group Chat</h1>
      </div>
      <div className="flex justify-center px-5">
        <input
          type="text"
          className="input input-bordered w-full mr-3"
          placeholder="Search Group"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn" onClick={() => document.getElementById("my_modal_3").showModal()}>
          <img src={photos.addgroup} className="xl:w-5" />
        </button>
      </div>

      {/* Modal Create Group */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Create New Group</h3>
          <p className="py-4">Select recipients:</p>
          <div className="max-h-60 overflow-y-auto">
            {contacts.map((contact) => (
              <label key={contact.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={contact.user_id}
                  checked={selectedRecipients.includes(contact.user_id)}
                  onChange={() => handleSelectRecipient(contact.user_id)}
                />
                {contact.name}
              </label>
            ))}
          </div>
          <button className="btn btn-primary mt-4" onClick={handleCreateGroup} disabled={creating}>
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </dialog>

      {/* List Group */}
      <div className="overflow-x-hidden mt-8 h-[85vh]">
        <table className="table">
          <tbody>
            {filteredGroups.map(({ group_id, name, description, members, img }) => (
              <tr
                key={group_id}
                className="w-full hover"
                onClick={() => {
                  localStorage.setItem("GroupId", group_id);
                  localStorage.setItem("GroupName", name);
                  localStorage.setItem("GroupDescription", description);
                  localStorage.setItem("GroupMembers", JSON.stringify(members)); // Simpan sebagai JSON
                  localStorage.setItem("GroupImg", img);
                  onSelectGroup(group_id);
                }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="rounded-full border border-gray-900 h-20 w-20">
                        <img src={img} alt={name} />
                      </div>
                    </div>
                    <div className="tooltip tooltip-bottom" data-tip={name}>
                      <div className="font-bold text-lg">{name}</div>
                      <div className="text-gray-400 text-sm">Division: {description}</div>
                      <div className="text-gray-400 text-sm">
                        Members: {members.length > 0 ? members.length : "No members"}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupKontak;
