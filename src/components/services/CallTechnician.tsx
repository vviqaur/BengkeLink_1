
import { useState } from 'react';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface CallTechnicianProps {
  onBack: () => void;
  onNext: (data: ServiceBookingData) => void;
}

interface ServiceBookingData {
  location: string;
  vehicleType: string;
  services: string[];
  problems: string[];
  description: string;
}

const CallTechnician = ({ onBack, onNext }: CallTechnicianProps) => {
  const [step, setStep] = useState<'location' | 'details'>('location');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [formData, setFormData] = useState<ServiceBookingData>({
    location: '',
    vehicleType: '',
    services: [],
    problems: [],
    description: ''
  });

  const recommendedLocations = [
    'Rumah - Jl. Sudirman No. 123',
    'Kantor - Jl. Thamrin No. 45',
    'Mall Gading Serpong',
    'Universitas Multimedia Nusantara'
  ];

  const vehicleTypes = [
    'Mobil - Sedan',
    'Mobil - SUV',
    'Mobil - Hatchback',
    'Motor - Bebek',
    'Motor - Sport',
    'Motor - Matic'
  ];

  const serviceTypes = [
    'Ganti Oli',
    'Service AC',
    'Tune Up',
    'Kelistrikan',
    'Rem',
    'Ban',
    'Radiator'
  ];

  const problemTypes = [
    'Mesin tidak hidup',
    'AC tidak dingin',
    'Rem blong',
    'Ban bocor',
    'Lampu mati',
    'Suara aneh',
    'Overheat'
  ];

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setFormData(prev => ({ ...prev, location }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleProblemToggle = (problem: string) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.includes(problem)
        ? prev.problems.filter(p => p !== problem)
        : [...prev.problems, problem]
    }));
  };

  const handleNext = () => {
    if (step === 'location') {
      if (!selectedLocation) return;
      setStep('details');
    } else {
      if (!formData.vehicleType || formData.services.length === 0) return;
      onNext(formData);
    }
  };

  if (step === 'location') {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Panggil Teknisi</h1>
          </div>
        </header>

        <main className="p-4 space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardContent className="p-6">
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Peta Lokasi</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Alamat Detail</Label>
                <Input
                  id="location"
                  placeholder="Masukkan alamat lengkap..."
                  value={selectedLocation}
                  onChange={(e) => handleLocationSelect(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recommended Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lokasi Tersimpan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recommendedLocations.map((location, index) => (
                <Button
                  key={index}
                  variant={selectedLocation === location ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleLocationSelect(location)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {location}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Button 
            onClick={handleNext} 
            className="w-full btn-primary"
            disabled={!selectedLocation}
          >
            Lanjutkan
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setStep('location')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Detail Layanan</h1>
            <p className="text-sm text-muted-foreground">{selectedLocation}</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kendaraan & Layanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label>Jenis Kendaraan *</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kendaraan" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Types */}
            <div className="space-y-3">
              <Label>Jenis Layanan * (bisa pilih lebih dari satu)</Label>
              <div className="grid grid-cols-2 gap-2">
                {serviceTypes.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <Label htmlFor={service} className="text-sm">{service}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Types */}
            <div className="space-y-3">
              <Label>Masalah (bisa pilih lebih dari satu)</Label>
              <div className="grid grid-cols-2 gap-2">
                {problemTypes.map((problem) => (
                  <div key={problem} className="flex items-center space-x-2">
                    <Checkbox
                      id={problem}
                      checked={formData.problems.includes(problem)}
                      onCheckedChange={() => handleProblemToggle(problem)}
                    />
                    <Label htmlFor={problem} className="text-sm">{problem}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Masalah</Label>
              <textarea
                id="description"
                className="w-full p-3 border border-border rounded-md min-h-[100px] resize-none"
                placeholder="Jelaskan detail masalah kendaraan Anda..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep('location')}>
            Batal
          </Button>
          <Button 
            className="flex-1 btn-primary" 
            onClick={handleNext}
            disabled={!formData.vehicleType || formData.services.length === 0}
          >
            Cari Bengkel
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CallTechnician;
