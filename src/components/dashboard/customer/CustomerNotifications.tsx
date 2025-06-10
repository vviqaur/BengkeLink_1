
import { useState } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CustomerNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'service_completed',
      title: 'Servis Selesai',
      message: 'Servis berkala Anda di Bengkel Maju Jaya telah selesai. Silakan ambil kendaraan Anda.',
      timestamp: new Date('2024-01-15T14:30:00'),
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Reminder Servis',
      message: 'Waktunya untuk servis berkala kendaraan Anda. Sudah 3 bulan sejak servis terakhir.',
      timestamp: new Date('2024-01-14T09:00:00'),
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'promo',
      title: 'Promo Spesial!',
      message: 'Dapatkan diskon 20% untuk servis AC mobil di bulan ini. Berlaku hingga 31 Januari.',
      timestamp: new Date('2024-01-13T10:15:00'),
      isRead: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'booking_confirmed',
      title: 'Booking Dikonfirmasi',
      message: 'Booking servis Anda untuk tanggal 16 Januari telah dikonfirmasi oleh Bengkel Sejahtera.',
      timestamp: new Date('2024-01-12T16:45:00'),
      isRead: true,
      priority: 'medium'
    }
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'service_completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'promo':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'booking_confirmed':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Penting</Badge>;
      case 'medium':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Info</Badge>;
      default:
        return null;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} menit lalu`;
    } else if (hours < 24) {
      return `${hours} jam lalu`;
    } else {
      return `${days} hari lalu`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Notifikasi</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} notifikasi belum dibaca
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`cursor-pointer transition-colors ${
              !notification.isRead 
                ? 'border-l-4 border-l-primary bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{notification.title}</CardTitle>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {notification.message}
                    </CardDescription>
                  </div>
                </div>
                {getPriorityBadge(notification.priority)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(notification.timestamp)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak ada notifikasi</h3>
          <p className="text-muted-foreground">
            Semua notifikasi akan muncul di sini
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerNotifications;
