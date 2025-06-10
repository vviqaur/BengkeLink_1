
import { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Promo } from '@/types/promo';

interface PromoDetailProps {
  promo: Promo;
  onBack: () => void;
  userProfile: {
    isNewUser: boolean;
    serviceCount: number;
    inviteCount: number;
  };
}

const PromoDetail = ({ promo, onBack, userProfile }: PromoDetailProps) => {
  const [isClaimed, setIsClaimed] = useState(promo.claimedBy.includes('current-user'));
  const { toast } = useToast();

  const checkEligibility = () => {
    if (promo.eligibility.isNewUser && !userProfile.isNewUser) {
      return false;
    }
    if (promo.eligibility.minServiceCount && userProfile.serviceCount < promo.eligibility.minServiceCount) {
      return false;
    }
    if (promo.eligibility.minInviteCount && userProfile.inviteCount < promo.eligibility.minInviteCount) {
      return false;
    }
    if (promo.eligibility.dateRestriction) {
      const today = new Date();
      const restrictionDate = new Date(promo.eligibility.dateRestriction);
      if (today.toDateString() !== restrictionDate.toDateString()) {
        return false;
      }
    }
    return true;
  };

  const isEligible = checkEligibility();
  const isExpired = new Date() > promo.expiryDate;

  const handleClaim = () => {
    if (!isEligible || isClaimed || isExpired) return;

    setIsClaimed(true);
    
    const messages: { [key: string]: string } = {
      'promo-1': 'Promo Pengguna Baru berhasil diklaim! Gunakan pada pemesanan pertama Anda.',
      'promo-2': 'Promo Awal Bulan berhasil diklaim! Gunakan pada pemesanan berikutnya.',
      'promo-3': 'Promo Undang Teman berhasil diklaim! Bonus akan ditambahkan ke akun Anda.',
      'promo-4': 'Promo Pengguna Setia berhasil diklaim! Gunakan pada pemesanan berikutnya.',
      'promo-5': 'Promo Hari Pancasila berhasil diklaim! Gunakan pada 1 Juni 2025.',
      'promo-6': 'Promo Tanggal Kembar 6.6 berhasil diklaim! Gunakan pada 6 Juni 2025.'
    };

    toast({
      title: "Promo Berhasil Diklaim!",
      description: messages[promo.id] || `${promo.title} berhasil diklaim!`,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getButtonText = () => {
    if (isClaimed) return 'Sudah Diklaim';
    if (isExpired) return 'Sudah Kadaluarsa';
    if (!isEligible) return 'Klaim Sekarang';
    return 'Klaim Sekarang';
  };

  const getIneligibilityReason = () => {
    if (promo.eligibility.isNewUser && !userProfile.isNewUser) {
      return 'Hanya untuk pengguna baru';
    }
    if (promo.eligibility.minServiceCount && userProfile.serviceCount < promo.eligibility.minServiceCount) {
      return `Minimal ${promo.eligibility.minServiceCount} pemesanan layanan`;
    }
    if (promo.eligibility.minInviteCount && userProfile.inviteCount < promo.eligibility.minInviteCount) {
      return `Minimal ${promo.eligibility.minInviteCount} teman diundang`;
    }
    if (promo.eligibility.dateRestriction) {
      const restrictionDate = new Date(promo.eligibility.dateRestriction);
      return `Hanya berlaku pada ${formatDate(restrictionDate)}`;
    }
    return 'Anda tidak memenuhi syarat';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">{promo.title}</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Promo Image */}
        <Card>
          <CardContent className="p-0">
            <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-primary/30 rounded-t-lg flex items-center justify-center">
              <div className="text-center text-primary">
                <h2 className="text-2xl font-bold">{promo.title}</h2>
                <p className="text-lg mt-2">
                  {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : 
                   promo.discountType === 'fixed' ? `Rp ${promo.discountValue.toLocaleString('id-ID')} OFF` :
                   `Bonus Rp ${promo.discountValue.toLocaleString('id-ID')}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Deskripsi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{promo.description}</p>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Syarat dan Ketentuan</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {promo.conditions.map((condition, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm text-muted-foreground">{condition}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Expiry Date */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm">
                Berlaku hingga: {formatDate(promo.expiryDate)}
              </span>
              {isExpired && (
                <Badge variant="destructive" className="ml-2">Kadaluarsa</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Claim Button */}
        <div className="space-y-3">
          <Button
            className={`w-full ${
              isClaimed || isExpired || !isEligible
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'btn-primary'
            }`}
            disabled={isClaimed || isExpired || !isEligible}
            onClick={handleClaim}
          >
            {isClaimed && <CheckCircle className="w-4 h-4 mr-2" />}
            {getButtonText()}
          </Button>
          
          {!isEligible && !isClaimed && !isExpired && (
            <p className="text-center text-sm text-muted-foreground">
              {getIneligibilityReason()}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PromoDetail;
