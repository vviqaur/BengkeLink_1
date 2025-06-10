
import { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationSelectionProps {
  onBack: () => void;
  onNext: (location: string) => void;
}

const LocationSelection = ({ onBack, onNext }: LocationSelectionProps) => {
  const [selectedLocation, setSelectedLocation] = useState('');

  const recommendedLocations = [
    'Rumah - Jl. Sudirman No. 123',
    'Kantor - Jl. Thamrin No. 45',
    'Mall Gading Serpong',
    'Universitas Multimedia Nusantara'
  ];

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const handleNext = () => {
    if (selectedLocation) {
      onNext(selectedLocation);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Pilih Lokasi</h1>
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
};

export default LocationSelection;
