import { useState } from "react";
import "../App.css";
import BroadcastKontak from "../components/BroadcastKontak";
import BroadcastChat from "../components/BroadcastChat";
import Sidebar from "../components/SideBar";

const App = () => {
  const [selectedGroup, setSelectedGroup] = useState({ id: null, name: null });

  const handleSelectGroup = (id, name) => {
    setSelectedGroup({ id, name });
  };

  return (
    <div className="main">
      <div className="flex">
        <span className="z-40">
          <Sidebar />
        </span>

        {/* GroupKontak (Daftar Kontak) */}
        <div className={`${selectedGroup.id ? "hidden" : ""} xl:block`}>
          <BroadcastKontak onSelectGroup={handleSelectGroup} />
        </div>

        {/* GroupChat (Chat yang dipilih) */}
        <div className={`xl:w-[73.9vw] ${selectedGroup.id ? "" : "hidden"} xl:block`}>
          {selectedGroup.id && (
            <BroadcastChat
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
