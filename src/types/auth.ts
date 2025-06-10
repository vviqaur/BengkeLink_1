// Tipe untuk role user
export type UserRole = 'customer' | 'technician' | 'workshop';

export interface BaseUser {
  // Properti utama
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  username?: string;
  
  // Properti autentikasi
  termsAccepted: boolean;
  isVerified: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // URL foto profil
  profilePhoto?: string;
  
  // Alias untuk kompatibilitas
  terms_accepted?: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  profile_photo_url?: string;
  
  // Untuk properti tambahan
  [key: string]: any;
}

export interface CustomerUser extends BaseUser {
  role: 'customer';
  // Properti spesifik customer
  address?: string;
  dateOfBirth?: string;
}

export interface TechnicianUser extends BaseUser {
  role: 'technician';
  // Properti spesifik teknisi
  specialization?: string;
  experienceYears?: number;
  isAvailable?: boolean;
  workshopName: string;
  partnershipNumber: string;
  idNumber: string;
  idPhoto: string;
  province: string;
  city: string;
  postalCode: string;
  detailAddress: string;
  operatingHours: Record<string, any>;
  services: string[];
  vehicleTypes: string[];
  technicianCount: number;
  ownerName: string;
  businessNumber: string;
  taxNumber: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  dateOfBirth: Date;
  rating: number;
  completedServices: number;
}

export interface WorkshopUser extends BaseUser {
  role: 'workshop';
  // Properti spesifik bengkel
  workshopName: string;
  province: string;
  city: string;
  postalCode: string;
  detailAddress: string;
  operatingHours: Record<string, any>;
  services: string[];
  vehicleTypes: string[];
  technicianCount: number;
  ownerName: string;
  businessNumber: string;
  taxNumber: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isApproved: boolean;
  rating: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export type User = CustomerUser | TechnicianUser | WorkshopUser;

export interface LoginCredentials {
  email?: string;
  username?: string;
  partnershipNumber?: string;
  password: string;
  role: UserRole;
}

export interface SignupData extends LoginCredentials {
  name: string;
  phone: string;
  role: UserRole;
  termsAccepted: boolean;
  // Untuk workshop
  workshopName?: string;
  detailAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  operatingHours?: string; // JSON string
  services?: string[];
  // File upload
  profilePhoto?: File | null;
  idPhoto?: File | null;
  // Properti tambahan
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
