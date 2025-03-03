import React, { useState, useEffect } from "react";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [division, setDivision] = useState("");
  const [classs, setClasss] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  // Fetch members data
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/contact", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, [token]);

  // Generate default avatar
  const generateDefaultAvatar = (name) => {
    const words = name.split(" ");
    let avatarText = "";
    if (words.length >= 2) {
      avatarText = words[0].charAt(0) + words[1].charAt(0);
    } else if (words.length === 1) {
      avatarText = words[0].substring(0, 2);
    }
    return avatarText.toUpperCase();
  };

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = [member.name, member.divisi, member.kelas].some(
      field => field.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const matchesDivision = division ? member.divisi === division : true;
    const matchesClass = classs ? member.kelas === classs : true;
    
    return matchesSearch && matchesDivision && matchesClass;
  });

  // Delete member handler
  const handleDelete = async (userId) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/contact/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMembers(members.filter(member => member.user_id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Highlight text
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 text-black">{part}</span>
      ) : part
    );
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="xl:ml-16 xl:mr-14 mt-5 rounded-md border border-gray-700 flex justify-center">
      <div className="w-full">
        <div className="flex justify-between mx-10 mt-6">
          <div className="self-center">
            <div className="text-3xl font-semibold">All Members</div>
            <p className="text-green-600">Active Members: {members.length}</p>
          </div>
          
          <div className="self-center flex gap-2">
            <label className="self-center input input-bordered flex items-center gap-2">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="grow"
              />
            </label>

            {/* Division Dropdown */}
            <div className="form-control">
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
            </div>

            {/* Class Dropdown */}
            <div className="form-control">
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
        </div>

        <div className="overflow-x-auto max-h-[62vh]">
          <table className="table border-gray-700">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="text-xl font-semibold pl-10">Members Name</th>
                        <th className="text-xl font-semibold">Class</th>
                        <th className="text-xl font-semibold">Division</th>
                        <th className="text-xl font-semibold">Email</th>
                        <th className="text-xl font-semibold text-center">Status</th>
                        <th className="text-xl font-semibold text-center">Action</th>
                    </tr>
                </thead>
            <tbody>
              {filteredMembers.map(member => {
                const isDefaultImg = member.img === "http://127.0.0.1:8000/storage";
                
                return (
                  <tr key={member.user_id} className="border-b border-gray-700 hover:bg-gray-700 Z-10">
                    <td className="pl-10">
                      <div className="flex items-center gap-3">
                        <div className="avatar Z-10">
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
                        <div>
                          <div className="text-lg">
                            {highlightText(member.name, searchQuery)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="text-lg">
                        {highlightText(member.kelas, searchQuery)}
                      </div>
                    </td>
                    
                    <td>
                      <div className="text-lg">
                        {highlightText(member.divisi, searchQuery)}
                      </div>
                    </td>
                    
                    <td>
                      <div className="text-lg">{member.email}</div>
                    </td>
                    
                    <td className="text-center">
                      <button className={`btn px-8 text-lg ${
                        member.status === 'active' 
                          ? 'btn-success btn-outline' 
                          : 'btn-error btn-outline'
                      }`}>
                        {member.status}
                      </button>
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
                )}
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Members;