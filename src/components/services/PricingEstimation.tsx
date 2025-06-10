
import { useState } from 'react';
import { ArrowLeft, X, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ServiceBookingData {
  location: string;
  vehicleType: string;
  services: string[];
  problems: string[];
  description: string;
}

interface PricingEstimationProps {
  serviceData: ServiceBookingData;
  workshopName: string;
  onBack: () => void;
  onNext: () => void;
  onChat?: () => void;
  onCall?: (phoneNumber: string) => void;
  serviceType?: 'call' | 'book';
}

const PricingEstimation = ({ 
  serviceData, 
  workshopName, 
  onBack, 
  onNext, 
  onChat, 
  onCall,
  serviceType = 'call'
}: PricingEstimationProps) => {
  const [showModal, setShowModal] = useState(true);

  // Mock pricing calculation
  const servicePrice = serviceData.services.length * 150000;
  const componentPrice = Math.floor(Math.random() * 200000) + 50000;
  const platformFee = 15000;
  const tax = Math.floor((servicePrice + componentPrice + platformFee) * 0.11);
  const promo = -25000;
  const total = servicePrice + componentPrice + platformFee + tax + promo;

  const handleAccept = () => {
    setShowModal(false);
    onNext();
  };

  const handleChat = () => {
    if (onChat) {
      onChat();
    }
  };

  const handleCall = () => {
    if (onCall) {
      onCall('+62 812-3456-7890'); // Mock phone number
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Estimasi Harga</h1>
          {serviceType === 'call' && (
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="icon" onClick={handleChat}>
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleCall}>
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Estimasi Harga Layanan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Service Summary */}
            <Card>
              <CardHeader className="pb-3">
                <div className="text-center">
                  <h3 className="font-semibold">{workshopName}</h3>
                  <p className="text-sm text-muted-foreground">{serviceData.location}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Kendaraan:</p>
                  <p className="text-sm text-muted-foreground">{serviceData.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Layanan:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {serviceData.services.map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rincian Biaya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Biaya Layanan</span>
                  <span>Rp {servicePrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Perkiraan Komponen</span>
                  <span>Rp {componentPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee</span>
                  <span>Rp {platformFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pajak (11%)</span>
                  <span>Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Promo Pengguna Baru</span>
                  <span>Rp {promo.toLocaleString('id-ID')}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total Estimasi</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-muted-foreground">
              *Harga dapat berubah sesuai kondisi lapangan
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button className="flex-1 btn-primary" onClick={handleAccept}>
                Setuju
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background content when modal is closed */}
      {!showModal && (
        <main className="p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold mb-2">Pesanan Diterima</h2>
              <p className="text-muted-foreground">
                Estimasi harga telah disetujui. Melanjutkan ke status pemesanan...
              </p>
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  );
};

export default PricingEstimation;
