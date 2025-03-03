import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";

const Navbar = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

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

  // Hitung jumlah members
  const totalMembers = members.length;
  const programmingCount = members.filter(m => m.divisi === "Programming").length;
  const networkingCount = members.filter(m => m.divisi === "Networking").length;
  const multimediaCount = members.filter(m => m.divisi === "Multimedia").length;

  return (
    <div className="xl:px-16 xl:pt-10 w-full">
      <div className="mb-4">
        <h1 className="text-3xl">Hello, Admin</h1>
      </div>
      <div className="flex gap-5 justify-between w-full">
        <div className="flex gap-4 h-max py-4 border border-gray-700 px-4 rounded-md">
          <div className="border-r px-6 flex justify-start gap-5 self-center btn btn-outline border border-transparent h-max py-3 xl:w-[15vw]">
            <div className="bg-gray-700 rounded-full p-5 w-24 h-24 flex justify-center self-center">
              <img src={photos.privates} alt="" className="w-12 h-12 self-center" />
            </div>
            <div className="self-center">
              <h1 className="text-xl">Members</h1>
              <p className="text-5xl text-left">{totalMembers}</p>
              <p className="text-lg text-left">Member</p>
            </div>
          </div>
          <div className="line border-l border-gray-700 xl:h-28 self-center"></div>
          <div className="px-6 flex justify-start gap-5 self-center btn btn-outline border border-transparent h-max py-3 xl:w-[15vw]">
            <div className="bg-gray-700 rounded-full p-5 w-24 h-24 flex justify-center self-center">
              <img src={photos.group} alt="" className="w-12 h-12 self-center" />
            </div>
            <div className="self-center">
              <h1 className="text-xl">Group</h1>
              <p className="text-5xl text-left">18</p>
              <p className="text-lg text-left">Group</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 border border-gray-700 rounded-md px-4">
          <div className="border-r px-6 flex justify-start gap-5 self-center btn btn-outline border border-transparent h-max py-3 xl:w-[17vw]">
            <div className="bg-gray-700 rounded-full p-5 w-24 h-24 flex justify-center self-center">
              <img src={photos.privates} alt="" className="w-12 h-12 self-center" />
            </div>
            <div className="self-center">
              <h1 className="text-xl">Programming</h1>
              <p className="text-5xl text-left">{programmingCount}</p>
              <p className="text-lg text-left">Member</p>
            </div>
          </div>
          <div className="line border-l border-gray-700 xl:h-28 self-center"></div>
          <div className="border-r px-6 flex justify-start gap-5 self-center btn btn-outline border border-transparent h-max py-3 xl:w-[16vw]">
            <div className="bg-gray-700 rounded-full p-5 w-24 h-24 flex justify-center self-center">
              <img src={photos.privates} alt="" className="w-12 h-12 self-center" />
            </div>
            <div className="self-center">
              <h1 className="text-xl">Networking</h1>
              <p className="text-5xl text-left">{networkingCount}</p>
              <p className="text-lg text-left">Member</p>
            </div>
          </div>
          <div className="line border-l border-gray-700 xl:h-28 self-center"></div>
          <div className="border-r px-6 flex justify-start gap-5 self-center btn btn-outline border border-transparent h-max py-3 xl:w-[16vw]">
            <div className="bg-gray-700 rounded-full p-5 w-24 h-24 flex justify-center self-center">
              <img src={photos.privates} alt="" className="w-12 h-12 self-center" />
            </div>
            <div className="self-center">
              <h1 className="text-xl">Multimedia</h1>
              <p className="text-5xl text-left">{multimediaCount}</p>
              <p className="text-lg text-left">Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;