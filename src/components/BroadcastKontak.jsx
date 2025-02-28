import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";
import "./Kontak.css";

const GroupKontak = ({ onSelectGroup }) => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipients, setSelectedRecipients] = useState(new Set());
  const [creating, setCreating] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/contact", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchBroadcasts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/chat/broadcast/list", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setBroadcasts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
    fetchBroadcasts();
  }, [token]);

  const handleCreateBroadcast = async () => {
    setCreating(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/broadcast/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipient_ids: Array.from(selectedRecipients) }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const newBroadcast = await response.json();
      setBroadcasts((prev) => [newBroadcast, ...prev]);
      setSelectedRecipients(new Set());
      document.getElementById("my_modal_3").close();
    } catch (err) {
      alert("Error creating broadcast: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    const pusher = new Pusher("6cdc86054a25f0168d17", { cluster: "ap1" });
    const channel = pusher.subscribe("broadcast-chat-channel");

    // Event ketika ada pesan baru di broadcast
    const handleNewMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
    };

    // Event ketika ada broadcast baru dibuat
    const handleNewBroadcast = (newBroadcast) => {
        setBroadcasts((prevBroadcasts) => [newBroadcast, ...prevBroadcasts]);
    };

    channel.bind("broadcast-message-sent", handleNewMessage);
    channel.bind("broadcast-created", handleNewBroadcast); // Pastikan event ini sesuai dengan backend

    return () => {
        channel.unbind("broadcast-message-sent", handleNewMessage);
        channel.unbind("broadcast-created", handleNewBroadcast);
        channel.unsubscribe();
    };
}, []);

  
  const filteredBroadcasts = broadcasts.filter((broadcast) =>
    broadcast.id && broadcast.id.toString().includes(searchQuery)
  );
  

const handleSelectRecipient = (userId) => {
  setSelectedRecipients((prev) => {
    const newRecipients = new Set(prev);
    if (newRecipients.has(userId)) {
      newRecipients.delete(userId);
    } else {
      newRecipients.add(userId);
    }
    console.log("Selected Recipients:", Array.from(newRecipients));
    return newRecipients;
  });
};


  const renderRow = ({ id, recipient_ids, created_at }) => (
    <tr key={id} className="w-full hover" onClick={() => {
      localStorage.setItem("BroadcastId", id);
      onSelectGroup(id);
    }}>
      <td>
        <div className="flex flex-col">
          <div className="font-bold text-lg">Broadcast #{id}</div>
          <div className="text-gray-400 text-sm">{recipient_ids.length} recipients</div>
          <div className="text-gray-400 text-sm">Sent on: {new Date(created_at).toLocaleString()}</div>
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
            <label htmlFor="my-drawer" className="drawer-button">
              <img src={photos.logo} alt="" className="w-10 ml-5" />
            </label>
          </div>
        </div>
        <h1 className="text-3xl font-semibold py-8 mx-5">Broadcast Chat</h1>
      </div>

      <div className="flex justify-center px-5">
        <input
          type="text"
          className="input input-bordered w-full mr-3"
          placeholder="Search by ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn" onClick={() => document.getElementById("my_modal_3").showModal()}>
          <img src={photos.addgroup} className="xl:w-5 w-6" />
        </button>
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Create New Broadcast</h3>
          <p className="py-4">Select recipients:</p>
          <div className="max-h-60 overflow-y-auto">
            {contacts.map(contact => (
              <label key={contact.id} className="flex items-center gap-2">
                <input
  type="checkbox"
  value={contact.user_id}
  checked={selectedRecipients.has(contact.user_id)}
  onChange={() => handleSelectRecipient(contact.user_id)}
/>

                {contact.name}
              </label>
            ))}
          </div>
          <button className="btn btn-primary mt-4" onClick={handleCreateBroadcast} disabled={creating}>
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </dialog>

      <div className="overflow-x-hidden mt-8 h-[85vh]">
        <table className="table">
          <tbody>{filteredBroadcasts.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupKontak;
