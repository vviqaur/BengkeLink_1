import { useState } from 'react';
import { MessageCircle, Send, Phone, Clock, PhoneCall } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const CustomerMessages = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  
  const [conversations] = useState([
    {
      id: '1',
      name: 'Ahmad Supardi',
      role: 'Teknisi',
      workshop: 'Bengkel Maju Jaya',
      avatar: '',
      lastMessage: 'Servis sudah selesai, kendaraan siap diambil',
      timestamp: new Date('2024-01-15T14:30:00'),
      unreadCount: 2,
      isOnline: true,
      phone: '+62 812-3456-7890',
      messages: [
        {
          id: '1',
          senderId: 'technician',
          content: 'Selamat siang, saya akan menangani servis kendaraan Anda hari ini',
          timestamp: new Date('2024-01-15T09:00:00'),
          type: 'text'
        },
        {
          id: '2',
          senderId: 'customer',
          content: 'Baik pak, kira-kira berapa lama ya?',
          timestamp: new Date('2024-01-15T09:05:00'),
          type: 'text'
        },
        {
          id: '3',
          senderId: 'technician',
          content: 'Untuk servis berkala sekitar 2-3 jam pak',
          timestamp: new Date('2024-01-15T09:10:00'),
          type: 'text'
        },
        {
          id: '4',
          senderId: 'technician',
          content: 'Servis sudah selesai, kendaraan siap diambil',
          timestamp: new Date('2024-01-15T14:30:00'),
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      name: 'Customer Service',
      role: 'Admin',
      workshop: 'BengkeLink Support',
      avatar: '',
      lastMessage: 'Terima kasih telah menggunakan layanan kami',
      timestamp: new Date('2024-01-14T16:20:00'),
      unreadCount: 0,
      isOnline: false,
      phone: '+62 21-1234-5678',
      messages: [
        {
          id: '1',
          senderId: 'admin',
          content: 'Halo! Ada yang bisa kami bantu?',
          timestamp: new Date('2024-01-14T16:00:00'),
          type: 'text'
        },
        {
          id: '2',
          senderId: 'customer',
          content: 'Saya ingin tanya tentang promo bulan ini',
          timestamp: new Date('2024-01-14T16:05:00'),
          type: 'text'
        },
        {
          id: '3',
          senderId: 'admin',
          content: 'Untuk bulan ini ada promo diskon 20% untuk servis AC mobil',
          timestamp: new Date('2024-01-14T16:10:00'),
          type: 'text'
        },
        {
          id: '4',
          senderId: 'admin',
          content: 'Terima kasih telah menggunakan layanan kami',
          timestamp: new Date('2024-01-14T16:20:00'),
          type: 'text'
        }
      ]
    }
  ]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return formatTime(date);
    } else if (days === 1) {
      return 'Kemarin';
    } else if (days < 7) {
      return `${days} hari lalu`;
    } else {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short'
      }).format(date);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleCall = (phoneNumber: string) => {
    setIsCalling(true);
    console.log('Calling:', phoneNumber);
    
    // Simulate call duration
    setTimeout(() => {
      setIsCalling(false);
    }, 5000);

    // In a real app, you would integrate with a calling service
    // For now, we'll just open the phone dialer
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  if (isCalling && selectedConversation) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] bg-gradient-to-b from-primary/20 to-primary/5">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage src={selectedConversation.avatar} />
              <AvatarFallback className="text-2xl">
                {selectedConversation.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{selectedConversation.name}</h2>
              <p className="text-muted-foreground">{selectedConversation.phone}</p>
              <p className="text-sm text-primary mt-2">Menghubungi...</p>
            </div>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <PhoneCall className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => setIsCalling(false)}
          >
            Tutup Panggilan
          </Button>
        </div>
      </div>
    );
  }

  if (selectedChat && selectedConversation) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedChat(null)}
            >
              ← Kembali
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedConversation.avatar} />
              <AvatarFallback>
                {selectedConversation.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{selectedConversation.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedConversation.role} • {selectedConversation.workshop}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleCall(selectedConversation.phone)}
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedConversation.messages.map((message) => (
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
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">Pesan</h1>

      <div className="space-y-3">
        {conversations.map((conversation) => (
          <Card 
            key={conversation.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setSelectedChat(conversation.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-base truncate">
                      {conversation.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(conversation.timestamp)}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs px-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {conversation.role} • {conversation.workshop}
                  </p>
                  <CardDescription className="text-sm truncate">
                    {conversation.lastMessage}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {conversations.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum ada pesan</h3>
          <p className="text-muted-foreground">
            Pesan dari teknisi dan bengkel akan muncul di sini
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerMessages;
