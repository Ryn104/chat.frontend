import { useState } from "react";
import "../App.css";
import GroupKontak from "../components/GroupKontak";
import GroupChat from "../components/GroupChat";
import Sidebar from "../components/SideBar";

const App = () => {
  const [selectedGroup, setSelectedGroup] = useState({ id: null, name: null });

  const handleSelectGroup = (id, name) => {
    setSelectedGroup({ id, name });
  };

  return (
    <div className="main">
      <div className="flex">
        {/* Sidebar */}
        <span className="z-40">
          <Sidebar />
        </span>

        {/* GroupKontak (Daftar Kontak) */}
        <div className={`${selectedGroup.id ? "hidden" : ""} xl:block`}>
          <GroupKontak onSelectGroup={handleSelectGroup} />
        </div>

        {/* GroupChat (Chat yang dipilih) */}
        <div className={`xl:w-[73.9vw] ${selectedGroup.id ? "" : "hidden"} xl:block`}>
          {selectedGroup.id && (
            <GroupChat
              key={selectedGroup.id}
              GroupId={selectedGroup.id}
              GroupName={selectedGroup.name}
              onBack={() => setSelectedGroup({ id: null, name: null })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
