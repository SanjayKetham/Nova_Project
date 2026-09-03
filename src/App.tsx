import { GmailBackground } from './components/GmailBackground';
import { ChatPopUpWidget } from './components/ChatPopUpWidget';

export function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100 font-sans">
      <GmailBackground />
      <ChatPopUpWidget />
    </div>
  );
}

export default App;
