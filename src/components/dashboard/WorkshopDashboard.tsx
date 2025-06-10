
import { useState } from 'react';
import { Bell, User, Plus, BarChart3, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WorkshopDashboard = () => {
  const [bookings] = useState([
    {
      id: '1',
      customerName: 'John Doe',
      service: 'Ganti Oli + Filter',
      vehicleType: 'Honda Civic 2020',
      date: '2024-06-09',
      time: '10:00',
      location: 'Di bengkel',
      status: 'pending' as const,
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      service: 'Service AC',
      vehicleType: 'Toyota Avanza 2019',
      date: '2024-06-09',
      time: '14:00',
      location: 'Jl. Gading Serpong No. 15',
      status: 'confirmed' as const,
    }
  ]);

  const [technicians] = useState([
    { id: '1', name: 'Ahmad Rahman', status: 'active', rating: 4.8, services: 125 },
    { id: '2', name: 'Budi Santoso', status: 'busy', rating: 4.6, services: 98 },
    { id: '3', name: 'Citra Dewi', status: 'offline', rating: 4.9, services: 156 },
  ]);

  const { user, logout } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-orange-100 text-orange-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'confirmed': return 'Dikonfirmasi';
      case 'active': return 'Aktif';
      case 'busy': return 'Sibuk';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

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
              <h1 className="text-lg font-bold">Bengkel Jaya Abadi</h1>
              <p className="text-sm text-muted-foreground">Dashboard Mitra</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
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
                  {user?.name?.charAt(0) || 'W'}
                </div>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Booking</TabsTrigger>
            <TabsTrigger value="technicians">Teknisi</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Booking Hari Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">+2 dari kemarin</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Teknisi Aktif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">dari 5 teknisi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rp 12.5M</div>
                  <p className="text-xs text-muted-foreground">+15% dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Rating Bengkel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">dari 814 review</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Booking Terbaru
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Lihat Semua
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">{booking.date} - {booking.time}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Booking Masuk</h2>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Booking Manual
              </Button>
            </div>

            <div className="space-y-4">
              {bookings.map(booking => (
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
                        <p className="text-muted-foreground">{booking.date} - {booking.time}</p>
                      </div>
                      <div>
                        <p className="font-medium">Lokasi:</p>
                        <p className="text-muted-foreground">{booking.location}</p>
                      </div>
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

          <TabsContent value="technicians" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manajemen Teknisi</h2>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Teknisi
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicians.map(technician => (
                <Card key={technician.id} className="card-interactive">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{technician.name}</CardTitle>
                      <Badge className={getStatusColor(technician.status)}>
                        {getStatusText(technician.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rating:</span>
                      <span className="font-medium">⭐ {technician.rating}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Layanan:</span>
                      <span className="font-medium">{technician.services}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Lihat Detail
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analitik & Laporan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pendapatan Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Layanan Populer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Ganti Oli</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service AC</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tune Up</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lainnya</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

export default WorkshopDashboard;
