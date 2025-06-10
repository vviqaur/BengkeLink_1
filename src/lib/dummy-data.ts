// src/lib/dummy-data.ts

export interface Promo {
  id: number;
  title: string;
  image: string;
  description: string;
  terms: string;
  expires: string;
  eligibility: (user: any) => boolean; // Simple eligibility function
  code: string;
}

export const dummyPromos: Promo[] = [
  {
    id: 1,
    title: "Promo Pengguna Baru",
    image: "/images/promos/GambarPoster1.png",
    description: "Nikmati diskon 50% untuk pemesanan layanan pertama Anda.",
    terms: "Hanya untuk pengguna baru yang belum pernah memesan layanan.",
    expires: "31-12-2025",
    eligibility: (user: any) => user.isNewUser, // Assuming a user object with isNewUser
    code: "NEWUSER50",
  },
  {
    id: 2,
    title: "Promo Awal Bulan",
    image: "/images/promos/GambarPoster2.png",
    description: "Dapatkan diskon 20% untuk setiap pemesanan di awal bulan.",
    terms: "Berlaku untuk semua pengguna.",
    expires: "30-06-2025",
    eligibility: () => true,
    code: "MONTH20",
  },
  {
    id: 3,
    title: "Promo Undang Teman",
    image: "/images/promos/GambarPoster3.png",
    description: "Dapatkan bonus Rp50.000 untuk setiap teman yang diundang dan memesan layanan.",
    terms: "Minimal 1 teman diundang yang berhasil memesan.",
    expires: "31-12-2025",
    eligibility: (user: any) => user.inviteCount >= 1, // Assuming inviteCount property
    code: "REFERRAL50K",
  },
  {
    id: 4,
    title: "Promo Pengguna Setia",
    image: "/images/promos/GambarPoster4.png",
    description: "Diskon 30% untuk pengguna dengan 5 atau lebih pemesanan.",
    terms: "Minimal 5 pemesanan layanan.",
    expires: "31-12-2025",
    eligibility: (user: any) => user.serviceCount >= 5, // Assuming serviceCount property
    code: "LOYAL30",
  },
  {
    id: 5,
    title: "Promo Hari Pancasila",
    image: "/images/promos/GambarPoster5.png",
    description: "Rayakan Hari Pancasila dengan diskon 25% untuk semua layanan.",
    terms: "Berlaku untuk semua pengguna, hanya pada 1 Juni 2025.",
    expires: "01-06-2025",
    eligibility: () => true,
    code: "PANCASILA25",
  },
  {
    id: 6,
    title: "Promo Tanggal Kembar 6.6",
    image: "/images/promos/GambarPoster6.png",
    description: "Diskon 66% untuk pemesanan pada tanggal 6 Juni 2025.",
    terms: "Berlaku untuk semua pengguna, hanya pada 6 Juni 2025.",
    expires: "06-06-2025",
    eligibility: () => true,
    code: "DOUBLE66",
  },
];

export interface BookingReminder {
  id: number;
  serviceName: string;
  date: string;
  status: 'Menunggu Konfirmasi' | 'Sedang Diproses' | 'Selesai';
}

export const dummyReminders: BookingReminder[] = [
  {
    id: 1,
    serviceName: 'Ganti Oli Shell Helix',
    date: '12 Juni 2025',
    status: 'Menunggu Konfirmasi',
  },
  {
    id: 2,
    serviceName: 'Servis AC Lengkap',
    date: '15 Juni 2025',
    status: 'Sedang Diproses',
  },
];

// --- WORKSHOP DUMMY DATA ---

export interface Technician {
  name: string;
  rating: number;
}

export interface OperationalHours {
  [key: string]: string;
}

export interface Workshop {
  id: number;
  name: string;
  image: string;
  address: string;
  mapsUrl: string;
  operationalHours: OperationalHours;
  rating: number;
  reviewCount: number;
  technicians: Technician[];
  services: string[];
}

export const dummyWorkshops: Workshop[] = [
  {
    id: 1,
    name: "Bengkel Jaya Abadi Auto",
    image: "/images/bengkel/GambarBengkel1.png",
    address: "RUKO FRANKFURT, Jl. Boulevard Raya Gading Serpong No.1 Blok 2C, Kelapa Dua, Tangerang Regency, Banten 15810",
    mapsUrl: "https://maps.app.goo.gl/3U3pcvCmPvbw4hH17",
    operationalHours: {
      Minggu: "08.00–17.00",
      Senin: "08.00–18.00",
      Selasa: "08.00–18.00",
      Rabu: "08.00–18.00",
      Kamis: "08.00–18.00",
      Jumat: "08.00–18.00",
      Sabtu: "08.00–18.00",
    },
    rating: 4.8,
    reviewCount: 814,
    technicians: [
      { name: "Iwan Indrawan", rating: 5 },
      { name: "Dunu Arianna", rating: 4.3 },
      { name: "Jenna Ortegy", rating: 4.7 },
      { name: "Mitty Oneanta", rating: 4.6 },
      { name: "Merwawan", rating: 4.7 },
    ],
    services: ["Servis Rutin", "Ganti Oli", "Tune Up", "AC", "Rem", "Kelistrikan"],
  },
  {
    id: 2,
    name: "Bengkel Sumber Rezeki Auto Repair",
    image: "/images/bengkel/GambarBengkel2.png",
    address: "Jl. Bhayangkara 1 No.91, Paku Jaya, Kec. Serpong Utara, Kota Tangerang Selatan, Banten 15324",
    mapsUrl: "https://maps.app.goo.gl/bsuzcwZAiH2kPojU7",
    operationalHours: {
      Minggu: "08.30–17.00",
      Senin: "08.30–17.00",
      Selasa: "08.30–17.00",
      Rabu: "08.30–17.00",
      Kamis: "08.30–17.00",
      Jumat: "Tutup",
      Sabtu: "08.30–17.00",
    },
    rating: 4.4,
    reviewCount: 521,
    technicians: [
      { name: "Andi Wijaya", rating: 4.8 },
      { name: "Budi Santoso", rating: 4.6 },
      { name: "Cahya Rizky", rating: 4.7 },
      { name: "Dedi Prasetya", rating: 4.5 },
      { name: "Eko Purwanto", rating: 4.6 },
    ],
    services: ["Servis Rutin", "Ganti Oli", "Tune Up", "AC", "Rem", "Kelistrikan"],
  },
  // Add more workshops as needed...
];

