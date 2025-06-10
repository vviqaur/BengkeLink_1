// src/pages/PromoDetailPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyPromos } from '@/lib/dummy-data';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const PromoDetailPage: React.FC = () => {
  const { promoId } = useParams<{ promoId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // In a real app, claimed status would come from a database.
  // We'll simulate it with local state for now.
  const [isClaimed, setIsClaimed] = useState(false);

  const promo = dummyPromos.find((p) => p.id.toString() === promoId);

  if (!promo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Promo Tidak Ditemukan</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
      </div>
    );
  }

  // Simulate user properties for eligibility check
  const mockUser = {
    ...user,
    isNewUser: true, // Example property
    inviteCount: 2,    // Example property
    serviceCount: 10,  // Example property
  };

  const isEligible = promo.eligibility(mockUser);

  const handleClaim = () => {
    if (!isEligible || isClaimed) return;

    // Simulate API call to claim promo
    setIsClaimed(true);
    toast.success(`Promo ${promo.title} berhasil diklaim!`, {
      description: `Kode promo ${promo.code} telah disimpan di akun Anda.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white shadow-sm sticky top-0 z-10 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold ml-4">{promo.title}</h1>
      </header>

      <main className="p-0">
        <img 
          src={promo.image} 
          alt={promo.title} 
          className="w-full h-48 object-cover"
        />
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Lengkap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{promo.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Syarat dan Ketentuan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>{promo.terms}</li>
                <li>Berlaku hingga: {promo.expires}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="flex flex-col items-center">
          <Button 
            onClick={handleClaim}
            disabled={!isEligible || isClaimed}
            className="w-full btn-primary"
          >
            {isClaimed ? 'Sudah Diklaim' : 'Klaim Sekarang'}
          </Button>
          {!isEligible && (
            <p className="text-red-500 text-sm mt-2">Anda tidak memenuhi syarat untuk promo ini.</p>
          )}
        </div>
      </footer>
    </div>
  );
};

export default PromoDetailPage;
