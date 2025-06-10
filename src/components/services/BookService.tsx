
import { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookServiceProps {
  onBack: () => void;
  onNext: (type: 'location' | 'workshop') => void;
}

const BookService = ({ onBack, onNext }: BookServiceProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Book Service</h1>
        </div>
      </header>

      <main className="p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Pilih Jenis Layanan</h2>
            <p className="text-muted-foreground">
              Pilih lokasi layanan yang Anda inginkan
            </p>
          </div>

          <Card className="card-interactive" onClick={() => onNext('location')}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Booking Layanan ke Lokasi</h3>
                <p className="text-sm text-muted-foreground">
                  Teknisi akan datang ke lokasi Anda
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-interactive" onClick={() => onNext('workshop')}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 bg-primary rounded text-primary-foreground flex items-center justify-center text-sm font-bold">
                  B
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Booking Layanan di Bengkel</h3>
                <p className="text-sm text-muted-foreground">
                  Anda datang ke bengkel yang dipilih
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BookService;
