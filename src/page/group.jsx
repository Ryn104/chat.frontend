import { useState } from "react";
import "../App.css";
import GroupKontak from "../components/GroupKontak";
import GroupChat from "../components/GroupChat";
import Sidebar from "../components/SideBar";
import Descriptiongroup from "../components/DescriptionGroup";

const AppGroup = () => {
  const [selectedGroup, setSelectedGroup] = useState({ name: null });
  const [isGroupDescriptOpen, setIsGroupDescriptOpen] = useState(false); // Status deskripsi grup

  const handleSelectGroup = (name) => {
    setSelectedGroup({ name });

    // Jika sebelumnya deskripsi terbuka, tetap buka
    setIsGroupDescriptOpen(isGroupDescriptOpen);
  };

  const toggleGroupDescription = () => {
    setIsGroupDescriptOpen((prev) => !prev); // Toggle deskripsi grup
  };

  return (
    <div className="main">
      <div className="flex">
        {/* Sidebar */}
        <div className="z-40">
          <Sidebar />
        </div>

        {/* GroupKontak (Daftar Grup) */}
        <div className={`${selectedGroup.name ? "hidden" : ""} xl:block`}>
          <GroupKontak onSelectGroup={handleSelectGroup} />
        </div>

        {/* GroupChat (Chat Grup yang Dipilih) */}
        <div className={`transition-all duration-300 ${selectedGroup.name ? (isGroupDescriptOpen ? "xl:w-[50vw] hidden xl:block" : "xl:w-[73.9vw]") : "hidden"} xl:block`}>
          {selectedGroup.name && (
            <GroupChat
              key={selectedGroup.name}
              GroupName={selectedGroup.name}
              onBack={() => setSelectedGroup({ name: null })}
              onToggleDescript={toggleGroupDescription} // Toggle deskripsi grup
              isDescriptOpen={isGroupDescriptOpen} // Status deskripsi grup
            />
          )}
        </div>

        {/* Description (Detail Grup) */}
        <div className={`xl:w-[23.9vw] transition-all duration-300 ${isGroupDescriptOpen ? "block" : "hidden"}`}>
          {isGroupDescriptOpen && (
            <Descriptiongroup
              onBackDesc={() => setIsGroupDescriptOpen(false)} // Tutup deskripsi grup
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AppGroup;
