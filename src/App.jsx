import { useState } from 'react';
import './App.css';
import Kontak from './components/Kontak';
import Chat from './components/Chat';
import GroupChat from './components/GroupChat'; // Import GroupChat component
import chatData from './assets/chatData';

function App() {
  const [selectedContact, setSelectedContact] = useState(null);  // Store selected contact or group
  const [chatType, setChatType] = useState('private');  // Either 'private' or 'group'

  const onSelectContact = (contact) => {
    if (contact === 'group') {
      setChatType('group');
      setSelectedContact(null); // Group chat has no single selected contact
    } else {
      setChatType('private');
      setSelectedContact(contact);
    }
  };

  return (
    <div className='main'>
      <Kontak onSelectContact={onSelectContact} />
      {chatType === 'private' ? (
        <Chat contactId={selectedContact} chatData={chatData} />
      ) : (
        <GroupChat groupId="123" />  // Replace with actual group ID
      )}
    </div>
  );
}

export default App;
