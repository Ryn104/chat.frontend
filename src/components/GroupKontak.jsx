import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";
import "./Kontak.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupKontak = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState(""); // Nama grup
  const [error, setError] = useState(null);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [creating, setCreating] = useState(false);
  const [groupImage, setGroupImage] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const token = localStorage.getItem("authToken");

    const fetchContacts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/contact", {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        if (!signal.aborted) setError(err.message);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/group-contacts", {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setGroups(data);
      } catch (err) {
        if (!signal.aborted) setError(err.message);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchContacts();
    fetchGroups();

    return () => controller.abort();
  }, []);

  const handleSelectRecipient = (userId) => {
    setSelectedRecipients((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }
  
    if (selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient.");
      return;
    }

    
    console.log("Group Image:", groupImage);

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("image", groupImage);
    selectedRecipients.forEach((id, index) => {
      formData.append(`members[${index}]`, id); // Kirim sebagai array
    });

  
    setCreating(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/group", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });
  
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const newGroup = await response.json();
  
      // Update the groups state with the new group
      setGroups((prev) => [newGroup, ...prev]);
      setSelectedRecipients([]);
      setGroupName(""); // Reset group name after creation
      setGroupImage(null); // Reset group image after creation
  
      // Close the modal
      document.getElementById("my_modal_3").close();
  
      // Notify the user
      toast.success("Group created successfully!");
    } catch (err) {
      console.error("Error creating group:", err);
      toast.error("Error creating group: " + err.message);
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
    <div className="xl:w-[22vw] w-[85.5vw] xl:border-gray-700 xl:border-r">
      <div className="flex">
        <div className="self-center xl:ml-6">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="drawer-button">
              <img src={photos.logo} alt="" className="w-10 ml-4" />
            </label>
          </div>
        </div>
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
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          <img src={photos.addgroup} className="w-6 xl:w-5" />
        </button>
      </div>

      {/* Modal Create Group */}
      <dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Create New Group</h3>


    {/* Input Image */}
    <label className="block mt-3 text-sm font-medium">Group Image</label>
    <div className="flex justify-center">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => setGroupImage(e.target.files[0])}
          accept="image/*"
        />
        {groupImage ? (
          <img
            src={URL.createObjectURL(groupImage)}
            alt="Group Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-500 text-sm">Upload</span>
          </div>
        )}
      </div>
    </div>

        {/* Input Nama Grup */}
        <label className="block mt-3 text-sm font-medium">Group Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
    {/* Pilih Anggota Grup */}
    <p className="py-4 font-semibold">Select Members:</p>
    <div className="max-h-60 overflow-y-auto border p-2 rounded-lg">
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <label key={contact.id} className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              value={contact.user_id}
              checked={selectedRecipients.includes(contact.user_id)}
              onChange={() => handleSelectRecipient(contact.user_id)}
            />
            {contact.name}
          </label>
        ))
      ) : (
        <p className="text-gray-500">No contacts available</p>
      )}
    </div>

    {/* Tombol Buat Grup */}
    <button
      className="btn btn-primary mt-4 w-full"
      onClick={handleCreateGroup}
      disabled={creating}
    >
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
                localStorage.setItem("GroupMembers", JSON.stringify(members));
                localStorage.setItem("GroupImg", img);
                onSelectGroup(group_id);
              }}
            >
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="rounded-full border border-gray-900 h-20 w-20">
                      <img src={img} alt={name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="font-bold text-lg">{name}</div>
                </div>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default GroupKontak;