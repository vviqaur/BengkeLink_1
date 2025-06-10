
import { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Users, Calendar, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Workshop } from '@/hooks/useWorkshops';

interface WorkshopDetailProps {
  workshop: Workshop;
  onBack: () => void;
  onNext: () => void;
  serviceType: 'call' | 'book';
}

const WorkshopDetail = ({ workshop, onBack, onNext, serviceType }: WorkshopDetailProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Detail Bengkel</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Workshop Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                <img 
                  src={workshop.image_url || '/placeholder.svg'} 
                  alt={workshop.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.textContent = workshop.name.charAt(0);
                  }}
                />
                <span className="text-2xl font-bold text-muted-foreground hidden">
                  {workshop.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{workshop.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{workshop.rating || 0}</span>
                    <span className="text-sm text-muted-foreground">({workshop.review_count || 0} ulasan)</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {workshop.distance || '1.2 km'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {workshop.estimatedTime || '15 menit'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workshop Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Bengkel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Jam Operasional</h4>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{workshop.operatingHours || '08:00 - 18:00'}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Alamat</h4>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">{workshop.address}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Layanan Tersedia</h4>
              <div className="flex flex-wrap gap-2">
                {workshop.services?.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technicians */}
        <Card>
          <CardHeader>
            <CardTitle>Teknisi Terbaik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workshop.technicians?.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {tech.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tech.specialties?.join(', ') || 'Teknisi Senior'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{tech.rating || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {workshop.phone && (
            <Button variant="outline" size="icon" onClick={() => window.open(`tel:${workshop.phone}`, '_self')}>
              <Phone className="w-4 h-4" />
            </Button>
          )}
          <Button className="flex-1 btn-primary" onClick={onNext}>
            {serviceType === 'call' ? 'Lihat Estimasi Harga' : 'Pilih Jadwal'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default WorkshopDetail;
