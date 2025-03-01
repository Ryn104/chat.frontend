import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";

const MemberList = ({ members, onAddMember, onRemoveMember }) => {
    const [newMemberId, setNewMemberId] = useState("");
  
    return (
      <div className="flex flex-col gap-4 w-full">
        <h1 className="xl:text-2xl font-semibold">Members ({members.length})</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMemberId}
            onChange={(e) => setNewMemberId(e.target.value)}
            className="p-2 border border-gray-700 rounded"
            placeholder="Masukkan ID User"
          />
          <button
            onClick={() => onAddMember(newMemberId)}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Tambah Member
          </button>
        </div>
        {members.map((member) => (
          <div
            key={member.id}
            className="p-4 border-b border-gray-700 flex items-center gap-4"
          >
            <img
              src={member.img || photos.Nun}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-500">
                {member.divisi} - {member.kelas}
              </p>
            </div>
            <button
              onClick={() => onRemoveMember(member.id)}
              className="ml-auto p-2 bg-red-500 text-white rounded"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    );
  };

const Description = ({ onBackDesc }) => {
  const GroupName = localStorage.getItem("GroupName") || "Unknown";
  const GroupImg = localStorage.getItem("GroupImg") || photos.defaultGroupImage;
  const GroupId = localStorage.getItem("GroupId");
  const token = localStorage.getItem("authToken");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupDescription, setGroupDescription] = useState(
    "tidak ada deskripsi"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(GroupName);
  const [editImage, setEditImage] = useState(null);
  const [editDescription, setEditDescription] = useState(groupDescription);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!GroupId || !token) {
      setError("GroupId atau token tidak ditemukan di localStorage");
      setLoading(false);
      return;
    }

    const fetchGroupMembers = async () => {
        try {
          setError(null);
          setLoading(true);
          const response = await fetch(
            `http://127.0.0.1:8000/api/chat/group/data/${GroupId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          if (!response.ok) {
            throw new Error("Gagal mengambil data");
          }
      
          const data = await response.json();
          console.log("🔍 Data dari API:", data);
      
          if (data.members && Array.isArray(data.members)) {
            setMembers(data.members);
          } else {
            throw new Error("Format data tidak sesuai");
          }
      
          setGroupDescription(data.description || "tidak ada deskripsi");
          setEditDescription(data.description || "tidak ada deskripsi");
        } catch (error) {
          console.error("❌ Error fetching members:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

    fetchGroupMembers();
  }, [GroupId, token]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", editName);
    formData.append("description", editDescription);
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/groups/${GroupId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("✅ Response API:", data);

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengupdate grup");
      }

      setGroupDescription(data.group.description);
      setEditName(data.group.name);
      localStorage.setItem("GroupName", data.group.name);

      if (data.group.img) {
        localStorage.setItem("GroupImg", data.group.img);
        setEditImage(null);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating group:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/groups/${GroupId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("✅ Response API:", data);

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus grup");
      }

      // Redirect atau lakukan sesuatu setelah grup dihapus
      // Redirect ke halaman grup
    window.location.href = "/group"; // Ganti dengan path halaman grup Anda
    // atau
    // window.location.reload(); // Jika ingin me-refresh halaman saat ini
    onBackDesc()
    } catch (error) {
      console.error("❌ Error deleting group:", error);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/groups/${GroupId}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
  
      const data = await response.json();
      console.log("✅ Response API:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Gagal menambahkan member");
      }
  
      // Refresh member list setelah menambahkan member
      fetchGroupMembers();
    } catch (error) {
      console.error("❌ Error adding member:", error);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/groups/${GroupId}/members`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
  
      const data = await response.json();
      console.log("✅ Response API:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus member");
      }
  
      // Refresh member list setelah menghapus member
      fetchGroupMembers();
    } catch (error) {
      console.error("❌ Error removing member:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex justify-center border-l border-gray-700 h-full w-[85.7vw] xl:w-full">
      <div className="xl:mt-10 mt-6 w-full">
        {/* Bagian Header Grup */}
        <div className="flex px-10 pt-2 xl:pb-10 pb-6 justify-between w-full border-b mb-5 border-gray-700">
          <div className="flex xl:gap-6 gap-4 mr-2">
            <img
              className="w-20 h-20 rounded-full"
              src={GroupImg}
              alt="profile"
            />
            <div className="self-center">
              <h1 className="xl:text-2xl font-semibold">{GroupName}</h1>
              <p className="xl:text-xl">{groupDescription}</p>
            </div>
          </div>
          <div className="self-center flex gap-4">
            <button onClick={() => setIsEditing(!isEditing)}>
              <img src={photos.edit} alt="edit" className="w-10 h-10" />
            </button>
            <button onClick={() => setShowDeleteModal(true)}>
              <img src={photos.dellete} alt="delete" className="w-10 h-10" />
            </button>
            <div onClick={onBackDesc}>
              <img src={photos.back} alt="back" className="w-10 h-10" />
            </div>
          </div>
        </div>
  
        {/* Form Edit Grup */}
        {isEditing && (
          <div className="px-10">
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="p-2 border border-gray-700 rounded"
                placeholder="Nama Grup"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="p-2 border border-gray-700 rounded"
                placeholder="Deskripsi Grup"
              />
              <input
                type="file"
                onChange={(e) => setEditImage(e.target.files[0])}
                className="p-2 border border-gray-700 rounded"
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        )}
  
        {/* Daftar Member */}
        <div className="flex px-10">
          <MemberList
            members={members}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
          />
        </div>
      </div>
  
      {/* Modal Hapus Grup */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Hapus Grup</h2>
            <p className="mb-4">Apakah Anda yakin ingin menghapus grup ini?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 bg-gray-500 text-white rounded"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteGroup}
                className="p-2 bg-red-500 text-white rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Description;