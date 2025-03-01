import React, { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import photos from "../assets/image.js";

const Chat = ({ contactId, onBack, onSelectDescript }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState("");

  const token = localStorage.getItem("authToken");
  const receiverId = localStorage.getItem("receiverId");
  const receiverName = localStorage.getItem("receiverName") || "Unknown";
  const receiverDivisi = localStorage.getItem("receiverDivisi") || "Unknown";
  const receiverImg = localStorage.getItem("receiverImg") || "Unknown";
  const receiverEmail = localStorage.getItem("receiverEmail") || "Unknown";
  const [broadcastId, setBroadcastId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const handleDeleteClick = (messageId) => {
    setMessageToDelete(messageId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (messageToDelete) {
      await handleDelete(messageToDelete);
    }
    setIsDeleteModalOpen(false);
    setMessageToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setMessageToDelete(null);
  };

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!receiverId) {
      setMessages([]);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("userId", data.id);
        } else {
          console.error("Gagal mengambil data user:", response.status);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      }
    };

    fetchUserData();

    const userId = localStorage.getItem("userId");

    const fetchChatData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/chat/${receiverId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          markAsRead();
        } else {
          console.error("Gagal mengambil data chat:", response.status);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data:", error);
      }
    };

    fetchChatData();
  }, [receiverId]);

  useEffect(() => {
    const pusher = new Pusher("6cdc86054a25f0168d17", {
      cluster: "ap1",
      encrypted: true,
    });

    const chatChannel = pusher.subscribe("chat-channel");
    const broadcastChannel = pusher.subscribe("broadcast-chat-channel");

    const handleNewMessage = (data) => {
      console.log("New message event received:", data); // Tambahkan log
      console.log("Current messages:", messages);
    
      if (data.message_id) {
        setMessages((prevMessages) => {
          const isMessageExist = prevMessages.some(
            (msg) => msg.message_id === data.message_id
          );
          return isMessageExist ? prevMessages : [...prevMessages, data];
        });
      }
    };
    
    

    const handleEditMessage = (data) => {
      console.log("Pesan yang diterima untuk edit:", data);

      if (!data.message_id) return;

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.message_id === data.message_id
            ? { ...msg, message_text: data.message_text }
            : msg
        )
      );
    };

    const handleDeleteMessage = (data) => {
      console.log("Pesan sebelum dihapus:", messages);
      console.log("Mencari message_id:", data.message_id);

      setMessages((prevMessages) => {
        const filteredMessages = prevMessages.filter(
          (msg) => String(msg.message_id) !== String(data.message_id)
        );

        console.log("Pesan setelah dihapus:", filteredMessages);
        return filteredMessages;
      });
    };

    const handleMarkAsRead = (data) => {
      console.log("Pesan dibaca event diterima:", data);

      if (!data.message_ids || !Array.isArray(data.message_ids)) {
        console.error("message_ids tidak ditemukan dalam event");
        return;
      }

      setMessages((prevMessages) => {
        console.log("Sebelum update:", prevMessages);
        const updatedMessages = prevMessages.map((msg) =>
          data.message_ids.includes(Number(msg.message_id))
            ? { ...msg, is_read: true }
            : msg
        );
        console.log("Setelah update:", updatedMessages);
        return updatedMessages;
      });
    };


    chatChannel.bind("message-sent", handleNewMessage);
    chatChannel.bind("message-updated", handleEditMessage);
    chatChannel.bind("message-deleted", handleDeleteMessage);
    chatChannel.bind("message-read", handleMarkAsRead);
    broadcastChannel.bind("broadcast-message-sent", handleNewMessage);

    return () => {
      chatChannel.unbind_all();
      chatChannel.unsubscribe();
      broadcastChannel.unbind_all();
      broadcastChannel.unsubscribe();
    };
  }, [receiverId, broadcastId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (editingMessageId) {
      // Jika sedang dalam mode edit, panggil fungsi handleEdit
      await handleEdit(editingMessageId, message);
      setEditingMessageId(null); // Matikan mode edit setelah selesai
      setMessage(""); // Reset input setelah pengeditan
    } else {
      // Jika tidak, kirim pesan baru
      const newMessage = {
        receiver_id: receiverId,
        message_text: message,
      };

      try {
        const response = await fetch("http://127.0.0.1:8000/api/chat/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMessage),
        });

        if (response.ok) {
          const data = await response.json(); // Ambil data lengkap dari respons server
          console.log("Pesan berhasil dikirim:", data);
          setMessage(""); // Reset input setelah pengiriman
        } else {
          console.error("Gagal mengirim pesan:", response.status);
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    }
  };

  const startEditing = (messageId, messageText) => {
    console.log("Editing Message ID:", messageId);
    console.log("Editing Message Text:", messageText);

    setEditingMessageId(messageId);
    setEditingMessageText(messageText);
    setMessage(messageText);
  };

  const handleEdit = async (messageId, newText) => {
    if (!newText.trim()) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/chat/message/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message_text: newText }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Pesan berhasil diedit:", data);

        // Perbarui pesan di state messages
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.message_id === messageId
              ? { ...msg, message_text: newText }
              : msg
          )
        );
      } else {
        console.error("Gagal mengedit pesan:", response.status);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengedit pesan:", error);
    }
  };

  const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-6 rounded-lg">
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDelete = async (messageId) => {
    console.log("Deleting message ID:", messageId);

    if (!messageId) {
      console.error("Message ID is undefined!");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/chat/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.message_id !== messageId)
        );
      } else {
        console.error("Gagal menghapus pesan:", response.status);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus pesan:", error);
    }
  };

  const markAsRead = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chat/messages/mark-as-read",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ receiver_id: receiverId }),
        }
      );

      if (response.ok) {
        console.log("Pesan berhasil ditandai sebagai dibaca");
      } else {
        console.error("Gagal menandai pesan sebagai dibaca:", response.status);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat menandai pesan:", error);
    }
  };

  // Function to generate default avatar text
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

    return avatarText.toUpperCase(); // Convert to uppercase
  };

  return (
    <div className="xl:w-full flex-col justify-between xl:h-[110vh] h-[112vh] w-[85.7vw]">
      {/* Header */}
      <div className="header w-full xl:h-[10%] h-[8%] flex border-b border-gray-700">
        <div className="kontak flex py-3 px-4 justify-between w-full">
          <div className="flex justify-between w-full xl:pr-6">
            <div className="flex gap-3">
              <button className="" onClick={() => onBack()}>
                <img src={photos.back} className="w-10" />
              </button>
              <div className="flex items-center">
                {receiverImg === "http://127.0.0.1:8000/storage" ? (
                  <div className="xl:w-[3.3vw] xl:h-[3.3vw] w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl">
                    {generateDefaultAvatar(receiverName)}
                  </div>
                ) : (
                  <img
                    className="xl:w-[3.3vw] xl:h-[3.3vw] w-12 h-12 rounded-full"
                    src={receiverImg}
                    alt="profile"
                    onError={(e) => {
                      // If the image fails to load, display the default avatar
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                  <div class="xl:w-[3.3vw] xl:h-[3.3vw] w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl">
                    ${generateDefaultAvatar(receiverName)}
                  </div>
                `;
                    }}
                  />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="font-semibold xl:text-2xl text-xl">
                  {receiverName}
                </h1>
                <p className="xl:text-lg text-md">{receiverDivisi}</p>
              </div>
            </div>
            <div className="self-center">
              <img
                src={photos.side}
                className="w-8 cursor-pointer"
                onClick={() => {
                  if (onSelectDescript) {
                    onSelectDescript(true); // Menandakan bahwa Description harus muncul
                  }
                }}
              />
            </div>


          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="value-chat px-5 pt-8 h-[76%] overflow-y-auto"
        ref={messagesContainerRef}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${message.sender_id === parseInt(localStorage.getItem("userId"))
                ? "chat-end"
                : "chat-start"
                }`}
            >
              <div className="chat-bubble max-w-[52%]">
                <strong>{message.sender_name}</strong>
                <p>{message.message_text}</p>
              </div>
              <div className="chat-footer opacity-50">
                <p>{message.date}</p>
                <p>{message.time}</p>
              </div>
              {message.sender_id ===
                parseInt(localStorage.getItem("userId")) && (
                  <div className="opacity-100">
                    <p
                      className="cursor-pointer text-blue-500"
                      onClick={() =>
                        startEditing(message.message_id, message.message_text)
                      }
                    >
                      <img src={photos.edit} alt="" className="w-4 mb-2" />
                    </p>
                    <p
                      className="cursor-pointer text-red-500"
                      onClick={() => handleDeleteClick(message.message_id)}
                    >
                      <img src={photos.dellete} alt="" className="w-4 mb-2" />
                    </p>
                    {message.is_read ? (
                      <img src={photos.ceklist1} alt="" className="w-4" />
                    ) : (
                      <img src={photos.ceklist2} alt="" className="w-4" />
                    )}
                  </div>
                )}
            </div>
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>

      {/* Input Chat */}
      <div className="input-chat px-4 py-1">
        <form
          onSubmit={submit}
          className="input input-bordered flex items-center gap-2 w-full xl:h-[45px] h-[4.5vh]"
        >
          <input
            type="text"
            className="grow text-lg"
            placeholder={editingMessageId ? "Edit Pesan" : "Masukkan Pesan"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="xl:mr-[-8px]">
            <img src={photos.logo} alt="" className="xl:w-8 w-6" />
          </button>
          {editingMessageId && (
            <button
              type="button"
              className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-gray-900 font-semibold px-4 py-1 rounded-md xl:ml-4 ml-[-4px] xl:mr-[-11px]"
              onClick={() => {
                setEditingMessageId(null); // Batalkan mode edit
                setMessage(""); // Reset input
              }}
            >
              Batal
            </button>
          )}
        </form>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        message="Apakah Anda yakin ingin menghapus pesan ini?"
      />
    </div>
  );
};

export default Chat;