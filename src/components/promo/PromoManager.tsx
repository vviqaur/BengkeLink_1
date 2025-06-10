
import { useState } from 'react';
import { Promo } from '@/types/promo';
import PromoDetail from './PromoDetail';

interface PromoManagerProps {
  onBack: () => void;
  initialPromoId?: string;
}

const PromoManager = ({ onBack, initialPromoId }: PromoManagerProps) => {
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(initialPromoId || null);

  // Mock user profile - in real app this would come from auth context
  const userProfile = {
    isNewUser: true,
    serviceCount: 3,
    inviteCount: 2
  };

  const promos: Promo[] = [
    {
      id: 'promo-1',
      title: 'Promo Pengguna Baru',
      description: 'Nikmati diskon 50% untuk pemesanan layanan pertama Anda.',
      image: '/lovable-uploads/promo1.png',
      discountType: 'percentage',
      discountValue: 50,
      code: 'NEWUSER50',
      conditions: [
        'Hanya untuk pengguna baru yang belum pernah memesan layanan',
        'Berlaku untuk semua jenis layanan',
        'Tidak dapat digabung dengan promo lain'
      ],
      expiryDate: new Date('2025-12-31'),
      isActive: true,
      eligibility: {
        isNewUser: true
      },
      claimedBy: []
    },
    {
      id: 'promo-2',
      title: 'Promo Awal Bulan',
      description: 'Dapatkan diskon 20% untuk setiap pemesanan di awal bulan.',
      image: '/lovable-uploads/promo2.png',
      discountType: 'percentage',
      discountValue: 20,
      code: 'MONTH20',
      conditions: [
        'Berlaku untuk semua pengguna',
        'Berlaku untuk pemesanan di tanggal 1-7 setiap bulan',
        'Maksimal penggunaan 2x per bulan'
      ],
      expiryDate: new Date('2025-06-30'),
      isActive: true,
      eligibility: {
        allUsers: true
      },
      claimedBy: []
    },
    {
      id: 'promo-3',
      title: 'Promo Undang Teman',
      description: 'Dapatkan bonus Rp50.000 untuk setiap teman yang diundang dan memesan layanan.',
      image: '/lovable-uploads/promo3.png',
      discountType: 'bonus',
      discountValue: 50000,
      code: 'INVITE50K',
      conditions: [
        'Minimal 1 teman diundang yang berhasil memesan',
        'Bonus diberikan setelah teman menyelesaikan pemesanan pertama',
        'Tidak ada batas maksimal undangan'
      ],
      expiryDate: new Date('2025-12-31'),
      isActive: true,
      eligibility: {
        minInviteCount: 1
      },
      claimedBy: []
    },
    {
      id: 'promo-4',
      title: 'Promo Pengguna Setia',
      description: 'Diskon 30% untuk pengguna dengan 5 atau lebih pemesanan.',
      image: '/lovable-uploads/promo4.png',
      discountType: 'percentage',
      discountValue: 30,
      code: 'LOYAL30',
      conditions: [
        'Minimal 5 pemesanan layanan sebelumnya',
        'Berlaku untuk semua jenis layanan',
        'Dapat digunakan setiap bulan'
      ],
      expiryDate: new Date('2025-12-31'),
      isActive: true,
      eligibility: {
        minServiceCount: 5
      },
      claimedBy: []
    },
    {
      id: 'promo-5',
      title: 'Promo Hari Pancasila',
      description: 'Rayakan Hari Pancasila dengan diskon 25% untuk semua layanan.',
      image: '/lovable-uploads/promo5.png',
      discountType: 'percentage',
      discountValue: 25,
      code: 'PANCASILA25',
      conditions: [
        'Berlaku untuk semua pengguna',
        'Hanya pada tanggal 1 Juni 2025',
        'Berlaku untuk semua jenis layanan'
      ],
      expiryDate: new Date('2025-06-01'),
      isActive: true,
      eligibility: {
        allUsers: true,
        dateRestriction: new Date('2025-06-01')
      },
      claimedBy: []
    },
    {
      id: 'promo-6',
      title: 'Promo Tanggal Kembar 6.6',
      description: 'Diskon 66% untuk pemesanan pada tanggal 6 Juni 2025.',
      image: '/lovable-uploads/promo6.png',
      discountType: 'percentage',
      discountValue: 66,
      code: 'DOUBLE66',
      conditions: [
        'Berlaku untuk semua pengguna',
        'Hanya pada tanggal 6 Juni 2025',
        'Maksimal 1 penggunaan per akun'
      ],
      expiryDate: new Date('2025-06-06'),
      isActive: true,
      eligibility: {
        allUsers: true,
        dateRestriction: new Date('2025-06-06')
      },
      claimedBy: []
    }
  ];

  const selectedPromo = promos.find(p => p.id === selectedPromoId);

  if (selectedPromo) {
    return (
      <PromoDetail
        promo={selectedPromo}
        onBack={() => setSelectedPromoId(null)}
        userProfile={userProfile}
      />
    );
  }

  // This shouldn't happen in normal flow, but just in case
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Promo tidak ditemukan</h2>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Kembali ke Home
        </button>
      </div>
    </div>
  );
};

export default PromoManager;
