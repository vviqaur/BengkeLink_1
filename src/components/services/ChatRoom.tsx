
import { useState } from 'react';
import { ArrowLeft, Send, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatRoomProps {
  onBack: () => void;
  onCall?: (phoneNumber: string) => void;
  technicianName: string;
  workshopName: string;
}

const ChatRoom = ({ onBack, onCall, technicianName, workshopName }: ChatRoomProps) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      senderId: 'technician',
      content: 'Halo, saya sedang dalam perjalanan ke lokasi Anda',
      timestamp: new Date('2024-01-15T14:30:00'),
      type: 'text'
    },
    {
      id: '2',
      senderId: 'customer',
      content: 'Baik pak, kira-kira berapa lama lagi ya?',
      timestamp: new Date('2024-01-15T14:35:00'),
      type: 'text'
    },
    {
      id: '3',
      senderId: 'technician',
      content: 'Sekitar 15 menit lagi pak, mohon ditunggu',
      timestamp: new Date('2024-01-15T14:40:00'),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        senderId: 'customer',
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'text' as const
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleCall = () => {
    if (onCall) {
      onCall('+62 812-3456-7890');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback>
              {technicianName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{technicianName}</h3>
            <p className="text-sm text-muted-foreground">
              Teknisi • {workshopName}
            </p>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={handleCall}>
          <Phone className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === 'customer' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.senderId === 'customer'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === 'customer' 
                  ? 'text-primary-foreground/70' 
                  : 'text-muted-foreground'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
