import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, UserCircle, Wrench, Calendar, Home, List, MessageSquare, BellDot, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dummyPromos, dummyReminders } from '@/lib/dummy-data';
import { useAuth } from '@/hooks/useAuth';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Dummy state for notifications
  const hasNewNotifications = true;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Pelanggan</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name || 'Pelanggan'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesanan Aktif</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Dalam proses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riwayat Pesanan</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total pesanan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ulasan Saya</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total ulasan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifikasi</CardTitle>
            <BellDot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Pesan belum dibaca</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Layanan Tersedia</CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <Button variant="outline" className="flex flex-col h-24 justify-center items-center space-y-2">
              <Wrench className="h-8 w-8 text-orange-500" />
              <span className="text-sm font-semibold">Panggil Teknisi</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 justify-center items-center space-y-2">
              <Calendar className="h-8 w-8 text-orange-500" />
              <span className="text-sm font-semibold">Booking Service</span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengingat Service</CardTitle>
          </CardHeader>
          <CardContent>
            {dummyReminders.length > 0 ? (
              <div className="space-y-3">
                {dummyReminders.map((reminder) => (
                  <div key={reminder.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-semibold">{reminder.serviceName}</p>
                      <p className="text-sm text-muted-foreground">{reminder.date}</p>
                    </div>
                    <Badge variant={reminder.status === 'Menunggu Konfirmasi' ? 'default' : 'secondary'}>
                      {reminder.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground text-center">Belum ada aktivitas booking service.</p>
            )}
          </CardContent>
        </Card>

        {/* Promos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Promo Untukmu!</CardTitle>
          </CardHeader>
          <CardContent className="flex overflow-x-auto space-x-4 p-2">
            {dummyPromos.map((promo) => (
              <div key={promo.id} className="flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-md bg-white">
                <img src={promo.image} alt={promo.title} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-bold truncate">{promo.title}</h3>
                  <p className="text-sm text-muted-foreground h-10 overflow-hidden">{promo.description}</p>
                  <Link to={`/promo/${promo.id}`} className="block mt-2">
                    <Button size="sm" className="w-full btn-primary">Lihat Detail</Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Floating Nav Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-t-lg">
        <div className="flex justify-around items-center h-16">
          <Button variant="ghost" className="flex flex-col h-full justify-center items-center space-y-1 text-orange-500">
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-full justify-center items-center space-y-1 text-muted-foreground">
            <List className="h-6 w-6" />
            <span className="text-xs">Activity</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-full justify-center items-center space-y-1 text-muted-foreground">
            <Bell className="h-6 w-6" />
            <span className="text-xs">Notification</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-full justify-center items-center space-y-1 text-muted-foreground">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs">Message</span>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CustomerDashboard;
