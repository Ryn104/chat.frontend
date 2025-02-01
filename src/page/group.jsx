import { useState } from "react";
import "../App.css";
import GroupKontak from "../components/GroupKontak";
import GroupChat from "../components/GroupChat";
import Sidebar from "../components/SideBar";

const App = () => {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroupName, setSelectedGroupName] = useState(null);

  const handleSelectGroup = (groupId, groupName) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
  };

  return (
    <div className="main">
      <div className="flex">
        <Sidebar />
        <GroupKontak onSelectGroup={handleSelectGroup} />
        <div className="xl:w-[73.9vw]">
          {selectedGroupId ? (
            <GroupChat key={selectedGroupId} groupId={selectedGroupId} groupName={selectedGroupName} />
          ) : (
            <p>Pilih grup untuk mulai chat</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
