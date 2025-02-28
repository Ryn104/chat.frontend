import { useState } from 'react';
import '../App.css';
import Kontak from '../components/Kontak';
import Chat from '../components/Chat';
import Sidebar from '../components/SideBar';
import Description from '../components/Description';

const App = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedDescript, setSelectedDescript] = useState(null);
  const [wasDescriptionOpen, setWasDescriptionOpen] = useState(false); // Simpan status deskripsi

  const handleSelectContact = (contact) => {
    if (selectedDescript) {
      setWasDescriptionOpen(true); // Jika deskripsi terbuka, simpan statusnya
    } else {
      setWasDescriptionOpen(false); // Jika tertutup, tetap tertutup
    }
    
    setSelectedContact(contact);
  };

  const handleSelectDescript = (desc) => {
    setSelectedDescript(desc);
    setWasDescriptionOpen(true); // Tandai bahwa deskripsi terbuka
  };

  return (
    <div className="main">
      <div className="flex">
        <div className="z-40">
          <Sidebar />
        </div>
        <div className={`${selectedContact ? 'hidden' : ''} xl:block`}>
          <Kontak onSelectContact={handleSelectContact} />
        </div>
        <div className={`transition-all duration-300 ${selectedContact ? (selectedDescript ? 'xl:w-[50vw]' : 'xl:w-[73.9vw]') : 'hidden'} xl:block`}>
          {selectedContact && (
            <Chat 
              key={selectedContact} 
              contactId={selectedContact} 
              onBack={() => setSelectedContact(null)} 
              onSelectDescript={handleSelectDescript}
            />
          )}
        </div>
        <div className={`xl:w-[23.9vw] transition-all duration-300 ${wasDescriptionOpen ? 'block' : 'hidden'}`}>
          {wasDescriptionOpen && selectedDescript && (
            <Description 
              key={selectedDescript}
              descId={selectedDescript}
              onBackDesc={() => {
                setSelectedDescript(null);
                setWasDescriptionOpen(false); // Jika ditutup, status reset
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
