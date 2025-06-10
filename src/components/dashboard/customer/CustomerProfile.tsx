
import { useState } from 'react';
import { User, Phone, Mail, MapPin, Car, Settings, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import ProfileEdit from './ProfileEdit';
import VehicleManagement from './VehicleManagement';

const CustomerProfile = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'profile' | 'edit' | 'vehicles' | 'settings'>('profile');
  
  const [vehicles] = useState([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Avanza',
      year: 2020,
      plateNumber: 'B 1234 ABC',
      color: 'Putih',
      isDefault: true
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      plateNumber: 'B 5678 DEF',
      color: 'Hitam',
      isDefault: false
    }
  ]);

  const [stats] = useState({
    totalServices: 15,
    completedServices: 13,
    averageRating: 4.8,
    memberSince: '2023'
  });

  const handleLogout = () => {
    logout();
  };

  const handleProfileSave = (data: any) => {
    // Here you would typically save to backend
    console.log('Saving profile data:', data);
    setCurrentView('profile');
  };

  if (currentView === 'edit') {
    return (
      <ProfileEdit
        onBack={() => setCurrentView('profile')}
        onSave={handleProfileSave}
      />
    );
  }

  if (currentView === 'vehicles') {
    return (
      <VehicleManagement
        onBack={() => setCurrentView('profile')}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setCurrentView('profile')}>
              <Edit className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Pengaturan Akun</h1>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Pengaturan Umum</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Notifikasi Push</span>
                    <Button variant="outline" size="sm">Atur</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bahasa</span>
                    <Button variant="outline" size="sm">Indonesia</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tema</span>
                    <Button variant="outline" size="sm">Terang</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Keamanan</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Ubah Password</span>
                    <Button variant="outline" size="sm">Ubah</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Verifikasi 2 Langkah</span>
                    <Button variant="outline" size="sm">Aktifkan</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Privasi</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Data Lokasi</span>
                    <Button variant="outline" size="sm">Kelola</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Riwayat Aktivitas</span>
                    <Button variant="outline" size="sm">Hapus</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.profilePhoto} />
              <AvatarFallback className="text-lg">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <CardDescription>Member sejak {stats.memberSince}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  ⭐ {stats.averageRating}
                </Badge>
                <Badge variant="outline">
                  {stats.completedServices} servis selesai
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={() => setCurrentView('edit')}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{user?.phone}</p>
              <p className="text-sm text-muted-foreground">Nomor Telepon</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Email</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{user?.address || 'Alamat belum diatur'}</p>
              <p className="text-sm text-muted-foreground">Alamat</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Kendaraan Saya</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setCurrentView('vehicles')}>
              <Car className="w-4 h-4 mr-2" />
              Tambah Kendaraan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {vehicle.brand} {vehicle.model} ({vehicle.year})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.plateNumber} • {vehicle.color}
                  </p>
                </div>
              </div>
              {vehicle.isDefault && (
                <Badge variant="secondary">Default</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{stats.totalServices}</p>
              <p className="text-sm text-muted-foreground">Total Servis</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.completedServices}</p>
              <p className="text-sm text-muted-foreground">Selesai</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings & Actions */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => setCurrentView('settings')}
        >
          <Settings className="w-4 h-4 mr-3" />
          Pengaturan Akun
        </Button>
        
        <Button 
          variant="destructive" 
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Keluar
        </Button>
      </div>
    </div>
  );
};

export default CustomerProfile;
