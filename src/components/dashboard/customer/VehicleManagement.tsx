
import { useState } from 'react';
import { ArrowLeft, Plus, Car, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface VehicleManagementProps {
  onBack: () => void;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  isDefault: boolean;
}

const VehicleManagement = ({ onBack }: VehicleManagementProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
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

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    year: '',
    plateNumber: '',
    color: ''
  });

  const vehicleBrands = [
    'Toyota', 'Honda', 'Suzuki', 'Daihatsu', 'Mitsubishi', 
    'Nissan', 'Mazda', 'Hyundai', 'KIA', 'BMW', 'Mercedes-Benz'
  ];

  const colors = [
    'Putih', 'Hitam', 'Silver', 'Merah', 'Biru', 'Kuning', 'Hijau', 'Abu-abu'
  ];

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVehicle.brand && newVehicle.model && newVehicle.year && newVehicle.plateNumber) {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        ...newVehicle,
        year: parseInt(newVehicle.year),
        isDefault: vehicles.length === 0
      };
      setVehicles(prev => [...prev, vehicle]);
      setNewVehicle({ brand: '', model: '', year: '', plateNumber: '', color: '' });
      setShowAddForm(false);
    }
  };

  const handleSetDefault = (id: string) => {
    setVehicles(prev => prev.map(vehicle => ({
      ...vehicle,
      isDefault: vehicle.id === id
    })));
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Tambah Kendaraan</h1>
          </div>
        </header>

        <main className="p-4 space-y-6">
          <form onSubmit={handleAddVehicle} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detail Kendaraan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Merek *</Label>
                  <Select value={newVehicle.brand} onValueChange={(value) => setNewVehicle(prev => ({ ...prev, brand: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih merek" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Contoh: Avanza, Civic, dll"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Tahun *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="Contoh: 2020"
                    min="1980"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Nomor Plat *</Label>
                  <Input
                    id="plateNumber"
                    value={newVehicle.plateNumber}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, plateNumber: e.target.value.toUpperCase() }))}
                    placeholder="Contoh: B 1234 ABC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Warna</Label>
                  <Select value={newVehicle.color} onValueChange={(value) => setNewVehicle(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih warna" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddForm(false)}>
                Batal
              </Button>
              <Button type="submit" className="flex-1 btn-primary">
                Simpan Kendaraan
              </Button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Kelola Kendaraan</h1>
          <div className="ml-auto">
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Car className="w-10 h-10 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </p>
                    {vehicle.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.plateNumber} • {vehicle.color}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!vehicle.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(vehicle.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada kendaraan</h3>
            <p className="text-muted-foreground mb-4">
              Tambahkan kendaraan Anda untuk mempermudah proses booking
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kendaraan
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default VehicleManagement;
