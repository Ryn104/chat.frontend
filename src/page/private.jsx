import { useState } from 'react';
import '../App.css';
import Kontak from '../components/Kontak';
import Chat from '../components/Chat';
import Sidebar from '../components/SideBar';

const App = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="main">
      <div className="flex">
        <div className="z-40">
          <Sidebar />
        </div>
        <div>
          <Kontak onSelectContact={setSelectedContact} />
        </div>
        <div className="xl:w-[73.9vw]">
          {selectedContact ? (
            <Chat key={selectedContact} contactId={selectedContact} />
          ) : (
            <p>Pilih kontak untuk mulai chat</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
