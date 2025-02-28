import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";

const Description = ({ onBackDesc }) => {
    const [members, setMembers] = useState([]);

    const GroupName = localStorage.getItem("GroupName") || "Unknown";
    const GroupDescription = localStorage.getItem("GroupDescription") || "Unknown";
    const GroupImg = localStorage.getItem("GroupImg") || "Unknown";
    const GroupId = localStorage.getItem("GroupId");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const storedMembers = localStorage.getItem("GroupMembers");
        if (storedMembers) {
            setMembers(JSON.parse(storedMembers));
        }
    }, []);

    useEffect(() => {
        if (!GroupId) {
            console.error("❌ GroupId tidak ditemukan di localStorage");
            return;
        }

        const fetchGroupMembers = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/group/${GroupId}/members`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("🔍 Data dari API:", data);

                if (data.members && Array.isArray(data.members)) {
                    setMembers(data.members);
                } else {
                    console.error("❌ Format data tidak sesuai:", data);
                    setMembers([]); // Pastikan tetap array agar tidak error saat di-map
                }
            } catch (error) {
                console.error("❌ Error fetching members:", error);
            }
        };

        fetchGroupMembers();
    }, [GroupId, token]);

    return (
        <div className="flex justify-center border-l border-gray-700 h-full w-[85.7vw] xl:w-full">
            <div className="xl:mt-10 mt-6 w-full">
                <div className="flex px-10 pt-2 xl:pb-10 pb-6 justify-between w-full border-b mb-5 border-gray-700">
                    <div className="flex xl:gap-6 gap-4 mr-2">
                        <img className="w-20 h-20 rounded-full" src={photos.Wandi} alt="profile" />
                        <div className="self-center">
                            <h1 className="xl:text-2xl font-semibold">{GroupName}</h1>
                            <p className="xl:text-xl">{GroupDescription || "No Description"}</p>
                        </div>
                    </div>
                    <div className="self-center" onClick={onBackDesc}>
                        <img src={photos.back} alt="" className="w-10 h-10" />
                    </div>
                </div>

                {/* Daftar Member */}
                <div className="flex px-10">
                    <div className="flex flex-col gap-4 w-full">
                        <h1 className="xl:text-2xl font-semibold">Members ({members.length})</h1>
                        {members.map((member) => (
                            <div key={member.id} className="p-4 border-b border-gray-700 flex items-center gap-4">
                                <img
                                    src={photos.Nun}
                                    alt={member.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.divisi} - {member.kelas}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Description;
