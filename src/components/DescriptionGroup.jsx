import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";

const Description = ({ onBackDesc }) => {
  const GroupName = localStorage.getItem("GroupName") || "Unknown";
  const GroupImg = localStorage.getItem("GroupImg") || photos.defaultGroupImage;
  const GroupId = localStorage.getItem("GroupId");
  const GroupAdmin = localStorage.getItem("GroupAdmin");
  const GroupAdminId = parseInt(localStorage.getItem("GroupAdminId")) || null;
  const GroupDibuat = localStorage.getItem("GroupDibuat");
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
  const [showUserModal, setShowUserModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]); // Pastikan ini diisi dengan data yang benar
  const [contacts, setContacts] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

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
      localStorage.setItem("GroupAdmin", data.owner.name);
      localStorage.setItem("GroupAdminId", data.owner.id);
      localStorage.setItem("GroupDibuat", data.created_at);

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

  const fetchCurrentUser = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }

      const responseData = await response.json();
      setCurrentUser(responseData.data); // Ambil 'data' dari response
    } catch (error) {
      console.error("❌ Error fetching:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const isAdmin = currentUser?.role === "admin";
  const isMentor = currentUser?.role === "mentor";
  const isOwner = currentUser?.id === GroupAdminId;
  const isMentorRole = userRole === "mentor";
  const isAdminRole = userRole === "admin";

  const getUserRoleInGroup = (groupId) => {
    if (!currentUser || !currentUser.groups) return null;

    const group = currentUser.groups.find(
      (g) => g.group_id === parseInt(groupId, 10)
    );
    return group ? group.role : "not a member";
  };

  useEffect(() => {
    if (currentUser && GroupId) {
      setUserRole(getUserRoleInGroup(GroupId));
    }
  }, [currentUser, GroupId]);

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
        localStorage.setItem("GroupAdmin", data.owner.name);
        localStorage.setItem("GroupAdminId", data.owner.id);
        localStorage.setItem("GroupDibuat", data.created_at);

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

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data user");
      }

      const data = await response.json();
      console.log(data);
      setAvailableUsers(data || []); // Ensure data is an array
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setAvailableUsers([]); // Set to empty array on error
    }
  };

  // Gunakan useEffect untuk memanggil fetchAvailableUsers saat komponen pertama kali di-render
  useEffect(() => {
    fetchAvailableUsers();
  }, []); // Dependency array kosong agar hanya dijalankan sekali

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

      onBackDesc();
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
      await fetchGroupMembers(); // Pastikan ini adalah async/await
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
      await fetchGroupMembers(); // Pastikan ini adalah async/await
    } catch (error) {
      console.error("❌ Error removing member:", error);
    }
  };
  const handleChangeRole = async (userId, newRole) => {
    if (!isAdmin && !isOwner && !isAdminRole) {
      alert("Hanya admin atau owner yang dapat mengubah role.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/group/${GroupId}/update-role`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId, // Tambahkan user_id
            role: newRole,
          }),
        }
      );

      const data = await response.json();
      console.log("Response:", response, "Data:", data); // Debugging response

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengubah role");
      }

      // Refresh daftar anggota setelah update
      fetchGroupMembers();
    } catch (error) {
      console.error("❌ Error updating role:", error);
    }
  };

  const UserModal = ({ users = [], onClose, onSelectUsers }) => {
    const handleSelectRecipient = (userId) => {
      setSelectedRecipients((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );
    };

    const handleSubmit = () => {
      onSelectUsers(selectedRecipients); // Kirim selectedRecipients ke parent
      onClose();
    };

    return (
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-800  p-6 rounded-lg w-96">
          <h2 className="text-2xl font-semibold mb-4">Pilih User</h2>
          <div className="max-h-64 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center gap-4 pl-5 py-2 hover:bg-gray-700 cursor-pointer rounded"
                onClick={() => handleSelectRecipient(user.user_id)}
              >
                <input
                  type="checkbox"
                  value={user.user_id}
                  checked={selectedRecipients.includes(user.user_id)}
                  onChange={() => handleSelectRecipient(user.user_id)}
                />
                <img
                  src={user.img || photos.Nun}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-semibold">{user.name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-500 text-white rounded"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-blue-500 text-white rounded"
            >
              Tambahkan
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MemberList = ({
    members,
    onAddMember,
    onRemoveMember,
    isAdminOrOwner,
    isMentor, // Tambahkan prop isMentor
    onEditToggle,
    onDeleteToggle,
  }) => {
    const [newMemberId, setNewMemberId] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    // Fungsi untuk menambahkan member
    const handleAddMember = (userId) => {
      if (isAdminOrOwner || isMentor) {
        onAddMember(userId);
      } else {
        alert("Hanya admin atau mentor yang dapat menambahkan member.");
      }
    };

    // Fungsi untuk menghapus member
    const handleRemoveMember = (memberId) => {
      if (isAdminOrOwner || isMentor) {
        onRemoveMember(memberId);
      } else {
        alert("Hanya admin atau mentor yang dapat menghapus member.");
      }
    };

    return (
      <div className="flex flex-col gap-4 w-full">
        {/* Bagian Informasi Grup */}
        <div className="border-b border-gray-700 px-10 pb-2">
          <div className="flex border-b pb-3 border-gray-700 w-full">
            <div>
              <p>Created by</p>
              <h1 className="xl:text-lg font-semibold">{GroupAdmin}</h1>
            </div>
          </div>
          <div className="flex  pb-3 w-full pt-4">
            <div>
              <p>Created on</p>
              <h1 className="xl:text-lg font-semibold">{GroupDibuat}</h1>
            </div>
          </div>

          {/* Tombol Edit dan Delete Group (hanya untuk admin) */}
          {isAdminOrOwner && (
            <div className="flex justify-between gap-4 xl:gap-0 border-t border-gray-700 pt-5 pb-3">
              <div>
                <button className="btn btn-outline" onClick={onEditToggle}>
                  <div className="flex xl:gap-3 gap-0">
                    <img src={photos.edit} alt="" className="w-6 h-6" />
                    <p className="self-center xl:text-lg text-md">Edit Group</p>
                  </div>
                </button>
              </div>
              <div>
                <button
                  className="btn btn-outline btn-error self-center"
                  onClick={onDeleteToggle}
                >
                  <div className="flex xl:gap-3 gap-0">
                    <img
                      src={photos.dellete}
                      alt=""
                      className="self-center w-6 h-6"
                    />
                    <p className="self-center xl:text-lg text-md">
                      Delete Group
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bagian Member */}
        <div className="flex flex-col gap-4 w-full">
          {/* Tombol Tambah Member (hanya untuk admin atau mentor) */}
          {(isAdminOrOwner || isMentor) && (
            <div className="flex gap-3 px-10">
              <button
                onClick={() => setShowUserModal(true)}
                className="flex justify-center px-5 btn"
              >
                <img
                  src={photos.adduser}
                  alt=""
                  className="self-center w-6 h-6"
                />
                <p className="self-center xl:text-lg text-md">Tambah Member</p>
              </button>
            </div>
          )}

          {/* Modal Pilih User */}
          {showUserModal && (
            <UserModal
              users={availableUsers}
              onClose={() => setShowUserModal(false)}
              onSelectUsers={(selectedIds) => {
                selectedIds.forEach((userId) => handleAddMember(userId));
                setShowUserModal(false);
              }}
            />
          )}

          {/* Daftar Member */}
          <h1 className="xl:text-2xl font-semibold px-10">
            Members ({members.length})
          </h1>
          <div
            className={`overflow-x-auto ${
              isAdminOrOwner
                ? "xl:max-h-[44vh] max-h-[45vh]"
                : "xl:max-h-[59vh] max-h-[61vh]"
            }`}
          >
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 border-b border-gray-700 flex items-center gap-4 mx-10"
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
                {/* Label "Owner" untuk admin */}
                {member.id == GroupAdminId && (
                  <span className="ml-auto bg-green-500 text-white px-2 py-1 rounded text-sm">
                    Owner
                  </span>
                )}
                {member.role === "mentor" ||
                  member.id !== GroupAdminId &&
                  isMentor && (
                    <span className="ml-auto bg-blue-500 text-white px-2 py-1 rounded text-sm">
                      Mentor
                    </span>
                  )}
                {/* Tombol Hapus Member (hanya untuk admin atau mentor) */}
                {(isAdminOrOwner || isMentor) && member.id != GroupAdminId && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="ml-auto p-2 text-white rounded"
                  >
                    <img src={photos.deleteperson} alt="" className="w-8 h-8" />
                  </button>
                )}
                {isAdminOrOwner && member.id !== GroupAdminId && (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleChangeRole(member.id, e.target.value)
                    }
                    className="ml-auto bg-gray-800 text-white px-2 py-1 rounded text-sm"
                  >
                    <option value="member">Member</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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
            <div onClick={onBackDesc}>
              <img src={photos.back} alt="back" className="w-10 h-10" />
            </div>
          </div>
        </div>
        {/* Form Edit Grup */}
        {isEditing && (
          <div className="px-10 pb-5 mb-5 border-b border-gray-700">
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="p-2 border border-gray-700 rounded input input-bordered flex items-center gap-2 w-full"
                placeholder="Nama Grup"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="p-2 border border-gray-700 rounded input input-bordered flex items-center gap-2 w-full"
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
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Daftar Member */}

        <MemberList
          members={members}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          isAdminOrOwner={isAdmin || isOwner || isAdminRole} // Properti baru yang sudah digabung
          onEditToggle={() => setIsEditing(!isEditing)}
          isMentor={isMentor || isMentorRole}
          onDeleteToggle={() => setShowDeleteModal(true)}
        />
      </div>

      {/* Modal Hapus Grup */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Hapus Grup</h2>
            <p className="mb-4">Apakah Anda yakin ingin menghapus grup ini?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2 px-4 bg-gray-500 text-white rounded"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteGroup}
                className="py-2 px-4 bg-red-500 text-white rounded"
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
