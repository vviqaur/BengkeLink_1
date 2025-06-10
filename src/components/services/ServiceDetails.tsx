
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ServiceDetailsProps {
  onBack: () => void;
  onNext: (data: ServiceBookingData) => void;
  location: string;
}

interface ServiceBookingData {
  location: string;
  vehicleType: string;
  services: string[];
  problems: string[];
  description: string;
}

const ServiceDetails = ({ onBack, onNext, location }: ServiceDetailsProps) => {
  const [formData, setFormData] = useState<ServiceBookingData>({
    location,
    vehicleType: '',
    services: [],
    problems: [],
    description: ''
  });

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
    if (formData.vehicleType && formData.services.length > 0) {
      onNext(formData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Detail Layanan</h1>
            <p className="text-sm text-muted-foreground">{location}</p>
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
          <Button variant="outline" className="flex-1" onClick={onBack}>
            Kembali
          </Button>
          <Button 
            className="flex-1 btn-primary" 
            onClick={handleNext}
            disabled={!formData.vehicleType || formData.services.length === 0}
          >
            Lanjutkan
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetails;
