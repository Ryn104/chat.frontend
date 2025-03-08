import React, { useState, useEffect } from "react";

const Members = () => {
  // State management
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [division, setDivision] = useState("");
  const [classs, setClasss] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Get authentication data from localStorage
  const token = localStorage.getItem("authToken");
  const GroupId = localStorage.getItem("GroupId");
  const GroupAdminId = parseInt(localStorage.getItem("GroupAdminId")) || null;

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const { data } = await response.json();
        setCurrentUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Determine user role in group
  useEffect(() => {
    const getUserRoleInGroup = () => {
      if (!currentUser?.groups || !GroupId) return null;
      const group = currentUser.groups.find(g => g.group_id === parseInt(GroupId));
      return group?.role || "not a member";
    };

    setUserRole(getUserRoleInGroup());
  }, [currentUser, GroupId]);

  // User role permissions
  const isAdmin = currentUser?.role === "admin";
  const isOwner = currentUser?.id === GroupAdminId;
  const canEditRole = isAdmin || isOwner || userRole === "admin";

  // Fetch members data
  // Pada fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/contact", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        // Tambahkan default role jika tidak ada
        const membersWithRole = data.map(member => ({
          ...member,
          role: member.role || "member"
        }));
        setMembers(membersWithRole);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [token]);

  // Avatar generator utility
  const generateDefaultAvatar = (name) => {
    const initials = name.split(" ")
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase();

    return initials.length >= 2 ? initials : name.substring(0, 2).toUpperCase();
  };

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = [member.name, member.divisi, member.kelas]
      .some(field => field.toLowerCase().includes(searchLower));

    return matchesSearch &&
      (!division || member.divisi === division) &&
      (!classs || member.kelas === classs);
  });

  // Delete member handler
  const handleDelete = async (userId) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/contact/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      setMembers(prev => prev.filter(member => member.user_id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Role change handler
  const handleChangeRole = async (userId, newRole) => {
    if (!canEditRole) {
      alert("Hanya admin atau owner yang dapat mengubah role");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/role`, {
        method: "PUT", // Pastikan method sesuai dengan backend (PUT/POST)
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah role");
      }

      // Pastikan struktur response sesuai
      const updatedRole = data.user?.role || newRole;

      setMembers(prev =>
        prev.map(member =>
          member.user_id === userId ? {
            ...member,
            role: updatedRole
          } : member
        )
      );

    } catch (error) {
      console.error("Role update error:", error);
      let errorMessage = "Terjadi kesalahan saat mengupdate role";
      
      if (error.response) {
        // Handle HTTP error codes
        if (error.response.status === 403) {
          errorMessage = "Anda tidak memiliki izin untuk mengubah role";
        } else if (error.response.status === 404) {
          errorMessage = "User tidak ditemukan";
        }
      }
      
      alert(errorMessage);
    }
  };

  // Highlight search matches
  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 text-black">{part}</span>
      ) : part
    );
  };

  // Loading and error states
  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="xl:ml-16 xl:mr-14 mt-5 rounded-md border border-gray-700 flex justify-center">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex justify-between mx-10 mt-6">
          <div>
            <h1 className="text-3xl font-semibold">All Members</h1>
            <p className="text-green-600">Active Members: {members.length}</p>
          </div>

          {/* Filters Section */}
          <div className="flex gap-2">
            <div className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="grow"
              />
            </div>

            <select
              className="select select-bordered"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            >
              <option value="">All Divisions</option>
              <option value="Programming">Programming</option>
              <option value="Multimedia">Multimedia</option>
              <option value="Networking">Networking</option>
            </select>

            <select
              className="select select-bordered"
              value={classs}
              onChange={(e) => setClasss(e.target.value)}
            >
              <option value="">All Classes</option>
              <option value="X">Class X</option>
              <option value="XI">Class XI</option>
              <option value="XII">Class XII</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto max-h-[62vh]">
          <table className="table border-gray-700">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-xl font-semibold pl-10">Name</th>
                <th className="text-xl font-semibold">Class</th>
                <th className="text-xl font-semibold">Division</th>
                <th className="text-xl font-semibold">Email</th>
                <th className="text-xl font-semibold text-center">Role</th>
                <th className="text-xl font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map(member => {
                const isDefaultImg = member.img === "http://127.0.0.1:8000/storage";

                return (
                  <tr key={member.user_id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="pl-10">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          {isDefaultImg ? (
                            <div className="rounded-full bg-gray-600 h-12 w-12 flex items-center justify-center">
                              <span className="text-white font-bold">
                                {generateDefaultAvatar(member.name)}
                              </span>
                            </div>
                          ) : (
                            <img
                              src={member.img}
                              alt={member.name}
                              className="rounded-full h-12 w-12"
                            />
                          )}
                        </div>
                        <div className="text-lg">
                          {highlightText(member.name, searchQuery)}
                        </div>
                      </div>
                    </td>

                    <td>{highlightText(member.kelas, searchQuery)}</td>
                    <td>{highlightText(member.divisi, searchQuery)}</td>
                    <td>{member.email}</td>

                    <td className="text-center">
                      {canEditRole && (
                        <select
                          value={member.role || "member"}
                          onChange={(e) => handleChangeRole(member.user_id, e.target.value)}
                          className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                        >
                          <option value="member">Member</option>
                          <option value="mentor">Mentor</option>
                          {isAdmin && <option value="admin">Admin</option>}
                        </select>
                      )}
                      {!canEditRole && member.role && (
                        <span className="badge badge-info">{member.role}</span>
                      )}
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(member.user_id)}
                        className="btn btn-outline btn-error px-8 text-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Members;