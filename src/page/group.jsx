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
        <span className="z-40">
            <Sidebar />
        </span>
        <span>
            <GroupKontak onSelectGroup={handleSelectGroup} />
        </span>
        <div className="xl:w-[73.9vw]">
          {selectedGroupId ? (
            <GroupChat key={selectedGroupId} groupId={selectedGroupId} groupName={selectedGroupName} />
          ) : (
            <div className='flex justify-center mt-[48vh]'>
                <p className='text-3xl'>Select a group to start a chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
