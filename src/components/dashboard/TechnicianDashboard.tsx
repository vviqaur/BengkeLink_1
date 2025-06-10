import { useState } from 'react';
import { Bell, User, MapPin, Clock, ToggleLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type BookingStatus = 'pending' | 'on_way' | 'in_progress' | 'completed';

interface Booking {
  id: string;
  customerName: string;
  service: string;
  vehicleType: string;
  location: string;
  time: string;
  status: BookingStatus;
  price: string;
}

const TechnicianDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      customerName: 'John Doe',
      service: 'Ganti Oli + Filter',
      vehicleType: 'Honda Civic 2020',
      location: 'Jl. Sudirman No. 123',
      time: '10:00',
      status: 'pending',
      price: 'Rp 250.000',
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      service: 'Service AC',
      vehicleType: 'Toyota Avanza 2019',
      location: 'Jl. Thamrin No. 45',
      time: '14:00',
      status: 'on_way',
      price: 'Rp 350.000',
    },
    {
      id: '3',
      customerName: 'Ahmad Rahman',
      service: 'Tune Up',
      vehicleType: 'Suzuki Ertiga 2021',
      location: 'Jl. Gatot Subroto No. 78',
      time: '16:00',
      status: 'completed',
      price: 'Rp 450.000',
    }
  ]);

  const { user, logout } = useAuth();

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'on_way': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'on_way': return 'Dalam Perjalanan';
      case 'in_progress': return 'Sedang Dikerjakan';
      case 'completed': return 'Selesai';
      default: return status;
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'on_way' || b.status === 'in_progress');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  // Mock workshop name for technician
  const workshopName = 'Bengkel Jaya Abadi';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/18c3e59c-93d8-4fb1-b29d-ad8245a52f1b.png" 
              alt="BengkeLink" 
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-lg font-bold">Teknisi BengkeLink</h1>
              <p className="text-sm text-muted-foreground">
                {workshopName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Availability Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`${isAvailable ? 'text-green-600' : 'text-gray-400'}`}
              >
                <ToggleLeft className="w-6 h-6" />
              </Button>
            </div>

            <Bell className="w-5 h-5 text-muted-foreground" />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {user?.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {user?.name?.charAt(0) || 'T'}
                </div>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Hari Ini</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value="active">Aktif ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Booking Hari Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">Total booking</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rp 1.05M</div>
                  <p className="text-xs text-muted-foreground">dari {completedBookings.length} layanan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    4.8 <Star className="w-4 h-4 text-yellow-500 ml-1" />
                  </div>
                  <p className="text-xs text-muted-foreground">dari 156 review</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {booking.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                        <p className="text-sm font-medium">{booking.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Booking Menunggu</h2>
              <Badge variant="secondary">{pendingBookings.length} booking</Badge>
            </div>

            <div className="space-y-4">
              {pendingBookings.map(booking => (
                <Card key={booking.id} className="card-interactive">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{booking.customerName}</CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Layanan:</p>
                        <p className="text-muted-foreground">{booking.service}</p>
                      </div>
                      <div>
                        <p className="font-medium">Kendaraan:</p>
                        <p className="text-muted-foreground">{booking.vehicleType}</p>
                      </div>
                      <div>
                        <p className="font-medium">Waktu:</p>
                        <p className="text-muted-foreground">{booking.time}</p>
                      </div>
                      <div>
                        <p className="font-medium">Harga:</p>
                        <p className="text-muted-foreground">{booking.price}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-sm">Lokasi:</p>
                      <p className="text-sm text-muted-foreground">{booking.location}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="btn-primary">Terima</Button>
                      <Button size="sm" variant="outline">Tolak</Button>
                      <Button size="sm" variant="outline">Reschedule</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Booking Aktif</h2>
              <Badge variant="secondary">{activeBookings.length} booking</Badge>
            </div>

            <div className="space-y-4">
              {activeBookings.map(booking => (
                <Card key={booking.id} className="card-interactive">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{booking.customerName}</CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Layanan:</p>
                        <p className="text-muted-foreground">{booking.service}</p>
                      </div>
                      <div>
                        <p className="font-medium">Kendaraan:</p>
                        <p className="text-muted-foreground">{booking.vehicleType}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-sm">Lokasi:</p>
                      <p className="text-sm text-muted-foreground">{booking.location}</p>
                    </div>

                    <div className="flex gap-2">
                      {booking.status === 'on_way' && (
                        <Button size="sm" className="btn-primary">Mulai Pengerjaan</Button>
                      )}
                      <Button size="sm" variant="outline">Hubungi Customer</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold">Riwayat Layanan</h2>
            
            <div className="space-y-4">
              {completedBookings.map(booking => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{booking.customerName}</CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Layanan:</p>
                        <p className="text-muted-foreground">{booking.service}</p>
                      </div>
                      <div>
                        <p className="font-medium">Pendapatan:</p>
                        <p className="text-muted-foreground">{booking.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              onClick={logout}
              className="w-full"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
