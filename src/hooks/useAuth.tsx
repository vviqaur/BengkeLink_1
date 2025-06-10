import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../components/ui/use-toast';
import { AuthError } from '@supabase/supabase-js';
import { 
  User, 
  UserRole, 
  CustomerUser, 
  TechnicianUser, 
  WorkshopUser,
  LoginCredentials,
  SignupData,
  AuthState
} from '../types/auth';

// Extended Profile interface to match database schema
interface DatabaseProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  profile_photo_url?: string;
  terms_accepted?: boolean;
  is_verified?: boolean;
  // Workshop specific fields
  workshop_name?: string;
  province?: string;
  city?: string;
  postal_code?: string;
  address?: string;
  operational_hours?: any;
  services?: any[];
  vehicle_types?: any[];
  technician_count?: number;
  owner_name?: string;
  owner_ktp_number?: string;
  owner_ktp_scan?: string;
  owner_phone?: string;
  nib?: string;
  npwp?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  is_approved?: boolean;
  rating?: number;
  verification_status?: 'pending' | 'verified' | 'rejected';
  // Technician specific fields
  partnership_number?: string;
  ktp_number?: string;
  ktp_scan?: string;
  birth_date?: string;
  is_available?: boolean;
  specialization?: string;
  experience_years?: number;
  // Add other fields as needed
}

// Using DatabaseProfile interface instead of type Profile

// --- TYPE DEFINITIONS ---

// Gunakan tipe dari auth.ts
type LoginResult = 
  | { success: true; role: UserRole }
  | { success: false; error: string };

interface AuthContextType {
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  signup: (data: SignupData) => Promise<{ requiresConfirmation?: boolean; success?: boolean; error?: string }>;
  logout: () => Promise<void>;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  
  const { user, isAuthenticated, isLoading } = authState;
  
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 2. UPDATED loadUserProfile ---
  const loadUserProfile = useCallback(async (userId: string, retries = 3, delay = 1000): Promise<boolean> => {
    if (!userId) return false;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1} to load profile for user: ${userId}`);
        
        // Dapatkan data profil dari database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single<{
            id: string;
            role: string;
            name: string;
            username: string | null;
            phone: string;
            profile_photo_url: string | null;
            address?: string;
            date_of_birth?: string;
            is_verified: boolean;
            created_at: string;
            updated_at: string;
          }>();

        if (error || !profile) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          if (attempt === retries - 1) {
            setAuthState(prev => ({ ...prev, isLoading: false }));
            return false;
          }
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        console.log('Profile data loaded:', profile);
        
        // Dapatkan sesi saat ini untuk mendapatkan email
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
        // Mapping data profil ke objek user
        const userData = {
          ...profile,
          email: session?.user?.email || '', // Email hanya dari session, tidak dari profile
          name: profile.name || 'Pengguna',
          role: (profile.role as UserRole) || 'customer',
          phone: profile.phone,
          username: profile.username || '',
          terms_accepted: false, // Default value, tidak ada di schema
          is_verified: profile.is_verified,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          profile_photo_url: profile.profile_photo_url || ''
        };

        console.log('Mapped user data:', userData);
        
        // Update state dengan data user yang baru
        setAuthState({ 
          user: mapToUser(userData), 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        console.log('User profile loaded and state updated');
        return true;
        
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed with error:`, error);
        if (attempt === retries - 1) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return false;
  }, [setAuthState]);

  // Fungsi untuk mengubah data dari format database ke format User
  const mapToUser = (data: any): User => {
    if (!data) {
      throw new Error('No profile data provided');
    }

    // Safely access properties with type guards
    const safeData = data;
    const role = (data.role as UserRole) || 'customer';
    
    // Handle different user roles with proper type assertions
    if (role === 'workshop') {
      const workshopUser: WorkshopUser = {
        id: data.id,
        email: data.email || '',
        name: data.name || 'Bengkel',
        role: 'workshop',
        phone: data.phone || '',
        username: data.username || '',
        termsAccepted: Boolean(safeData.terms_accepted || false),
        isVerified: Boolean(safeData.is_verified || false),
        createdAt: safeData.created_at || new Date().toISOString(),
        updatedAt: safeData.updated_at || new Date().toISOString(),
        profilePhoto: safeData.profile_photo_url || '',
        workshopName: safeData.workshop_name || '',
        province: safeData.province || '',
        city: safeData.city || '',
        postalCode: safeData.postal_code || '',
        detailAddress: safeData.address || '',
        address: safeData.address || '',
        operatingHours: safeData.operational_hours || {},
        services: Array.isArray(safeData.services) ? safeData.services : [],
        vehicleTypes: Array.isArray(safeData.vehicle_types) ? safeData.vehicle_types : [],
        technicianCount: Number(safeData.technician_count) || 0,
        ownerName: safeData.owner_name || '',
        businessNumber: safeData.nib || '',
        taxNumber: safeData.npwp || '',
        bankName: safeData.bank_name || '',
        accountNumber: safeData.bank_account_number || '',
        accountName: safeData.bank_account_holder || '',
        isApproved: Boolean(safeData.is_approved || false),
        rating: Number(safeData.rating) || 0,
        verificationStatus: (safeData.verification_status as 'pending' | 'verified' | 'rejected') || 'pending',
      };
      return workshopUser;
    }
    
    if (role === 'technician') {
      const technicianUser: TechnicianUser = {
        id: data.id,
        email: data.email || '',
        name: data.name || 'Teknisi',
        role: 'technician',
        phone: data.phone || '',
        username: data.username || '',
        termsAccepted: Boolean(safeData.terms_accepted || false),
        isVerified: Boolean(safeData.is_verified || false),
        createdAt: safeData.created_at || new Date().toISOString(),
        updatedAt: safeData.updated_at || new Date().toISOString(),
        profilePhoto: safeData.profile_photo_url || '',
        workshopName: safeData.workshop_name || '',
        partnershipNumber: safeData.partnership_number || '',
        idNumber: safeData.ktp_number || '',
        idPhoto: safeData.ktp_scan || '',
        province: safeData.province || '',
        city: safeData.city || '',
        detailAddress: safeData.address || '',
        address: safeData.address || '',
        operatingHours: safeData.operational_hours || {},
        services: Array.isArray(safeData.services) ? safeData.services : [],
        vehicleTypes: Array.isArray(safeData.vehicle_types) ? safeData.vehicle_types : [],
        isAvailable: Boolean(safeData.is_available || false),
        specialization: safeData.specialization || '',
        experienceYears: Number(safeData.experience_years) || 0,
        postalCode: safeData.postal_code || '',
        technicianCount: 0, // Default for technician
        ownerName: safeData.owner_name || '',
        businessNumber: safeData.nib || '',
        taxNumber: safeData.npwp || '',
        bankName: safeData.bank_name || '',
        accountNumber: safeData.bank_account_number || '',
        accountName: safeData.bank_account_holder || '',
        isApproved: Boolean(safeData.is_approved || false),
        verificationStatus: (safeData.verification_status as 'pending' | 'verified' | 'rejected') || 'pending',
        // Add missing required properties
        isActive: Boolean(safeData.is_active || true),
        dateOfBirth: safeData.date_of_birth ? new Date(safeData.date_of_birth) : new Date(),
        rating: Number(safeData.rating) || 0,
        completedServices: Number(safeData.completed_services) || 0
      };
      return technicianUser;
    }
    
    // Default to CustomerUser
    const customerUser: CustomerUser = {
      id: data.id,
      email: data.email || '',
      name: data.name || 'Pelanggan',
      role: 'customer',
      phone: data.phone || '',
      username: data.username || '',
      termsAccepted: Boolean(safeData.terms_accepted || false),
      isVerified: Boolean(safeData.is_verified || false),
      createdAt: safeData.created_at || new Date().toISOString(),
      updatedAt: safeData.updated_at || new Date().toISOString(),
      profilePhoto: safeData.profile_photo_url || '',
      address: safeData.address || '',
      dateOfBirth: safeData.birth_date || ''
    };
    return customerUser;
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResult> => {
    if ((!credentials.email && !credentials.partnershipNumber) || !credentials.password) {
      return { 
        success: false, 
        error: 'Email/Partnership number dan password diperlukan' 
      } satisfies LoginResult;
    }
    
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email || `${credentials.partnershipNumber}@workshop.bengkelink.com`,
        password: credentials.password,
      });

      if (error) {
        console.error('Login error:', error);
        // Check for specific error types
        if (error.message.includes('Invalid login credentials')) {
          return { 
            success: false, 
            error: 'Email/nomor kemitraan atau password salah' 
          } satisfies LoginResult;
        }
        return { 
          success: false, 
          error: error.message || 'Terjadi kesalahan saat login' 
        } satisfies LoginResult;
      }

      if (!data.user) {
        return { 
          success: false, 
          error: 'Gagal memuat data pengguna' 
        } satisfies LoginResult;
      }
      
      console.log('User authenticated, loading profile...');
      
      // Load user profile which will update the auth state
      const profileLoaded = await loadUserProfile(data.user.id);
      if (!profileLoaded) {
        console.error('Failed to load user profile');
        return { 
          success: false, 
          error: 'Gagal memuat profil pengguna' 
        } satisfies LoginResult;
      }
      
      // Get the user's role from the updated auth state
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No active session after login');
        return { 
          success: false, 
          error: 'Sesi tidak valid' 
        } satisfies LoginResult;
      }
      
      // Get fresh user data from auth state
      const currentUser = session.user;
      console.log('User session:', currentUser);
      
      // Get the user's role from the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();
      
      if (profileError || !profileData) {
        console.error('Error fetching user role:', profileError);
        return { 
          success: false, 
          error: 'Gagal memuat peran pengguna' 
        } satisfies LoginResult;
      }
      
      console.log('User logged in successfully with role:', profileData.role);
      
      // Return success with the user's role
      return { 
        success: true, 
        role: (profileData.role as UserRole) || 'customer' 
      } satisfies LoginResult;
      
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan saat login';
        
      toast({
        title: 'Login Gagal',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [loadUserProfile, setAuthState, toast]);

  const signup = useCallback(async (userData: SignupData): Promise<{ 
    requiresConfirmation?: boolean; 
    success: boolean; 
    error?: string 
  }> => {
    // Basic validation
    if (!userData?.email || !userData?.password || !userData?.name || !userData.phone) {
      const errorMsg = 'Nama, email, nomor telepon, dan password harus diisi';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return { success: false, error: errorMsg };
    }
    
    // Enhanced email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const testEmail = userData.email.trim();
    
    if (!testEmail) {
      const errorMsg = 'Email tidak boleh kosong';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return { success: false, error: errorMsg };
    }
    
    if (!emailRegex.test(testEmail)) {
      const errorMsg = `Format email tidak valid (${testEmail}). Contoh: nama@contoh.com`;
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return { success: false, error: errorMsg };
    }
    
    if (testEmail.endsWith('.')) {
      const errorMsg = 'Email tidak boleh diakhiri dengan titik';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return { success: false, error: errorMsg };
    }
    
    // Additional checks for common email issues
    if (userData.email.endsWith('.')) {
      const errorMsg = 'Email tidak boleh diakhiri dengan titik';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return { success: false, error: errorMsg };
    }
    
    // Password strength validation
    if (userData.password.length < 6) {
      const errorMsg = 'Password minimal 6 karakter';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      return { success: false, error: errorMsg };
    }
    
    try {

      // Register the user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: userData.role,
            name: userData.name,
            username: userData.username || userData.email.split('@')[0],
            phone: userData.phone,
            terms_accepted: userData.termsAccepted || false,
            ...(userData.role === 'workshop' && {
              workshop_name: userData.workshop_name,
              province: userData.province,
              city: userData.city,
              postal_code: userData.postal_code,
              address: userData.address,
              operational_hours: userData.operational_hours,
              services: userData.services,
              vehicle_types: userData.vehicle_types,
              technician_count: userData.technician_count,
              owner_name: userData.owner_name,
              owner_ktp_number: userData.owner_ktp_number,
              owner_ktp_scan: userData.owner_ktp_scan,
              owner_phone: userData.owner_phone,
              nib: userData.nib,
              npwp: userData.npwp,
              bank_name: userData.bank_name,
              bank_account_number: userData.bank_account_number,
              bank_account_holder: userData.bank_account_holder,
            }),
            ...(userData.role === 'technician' && {
              ktp_number: userData.ktp_number,
              ktp_scan: userData.ktp_scan,
              birth_date: userData.birth_date,
            }),
          },
        },
      });

      if (signUpError) {
        console.error('Registration error:', signUpError);
        
        // Handle specific Supabase error codes
        let errorMessage = 'Terjadi kesalahan saat mendaftar';
        
        switch (signUpError.code) {
          case 'email_address_in_use':
          case 'user_already_exists':
            errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain.';
            break;
            
          case 'email_not_allowed':
            errorMessage = 'Email tidak diizinkan. Silakan gunakan email yang valid.';
            break;
            
          case 'email_exceeds_max_length':
            errorMessage = 'Email terlalu panjang. Maksimal 255 karakter.';
            break;
            
          case 'email_invalid':
          case 'invalid_email':
            errorMessage = 'Format email tidak valid. Contoh: nama@contoh.com';
            break;
            
          case 'weak_password':
            errorMessage = 'Password terlalu lemah. Minimal 6 karakter.';
            break;
            
          case 'password_too_short':
            errorMessage = 'Password terlalu pendek. Minimal 6 karakter.';
            break;
            
          case 'network_failure':
            errorMessage = 'Koneksi jaringan bermasalah. Periksa koneksi internet Anda.';
            break;
            
          default:
            // Fallback to message-based detection if code is not available
            if (signUpError.message) {
              const msg = signUpError.message.toLowerCase();
              if (msg.includes('already registered') || msg.includes('already in use')) {
                errorMessage = 'Email sudah terdaftar';
              } else if (msg.includes('email')) {
                errorMessage = 'Format email tidak valid';
              } else if (msg.includes('phone')) {
                errorMessage = 'Format nomor telepon tidak valid';
              } else if (msg.includes('network')) {
                errorMessage = 'Koneksi jaringan bermasalah';
              }
            }
        }
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }

      // Success case
      if (authData?.user) {
        toast({
          title: 'Sukses',
          description: 'Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi.',
          variant: 'default'
        });
        
        return {
          requiresConfirmation: true,
          success: true
        };
      }
      
      // If we get here, something unexpected happened
      return {
        success: false,
        error: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.'
      };
      
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      const errorMessage = 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      
      toast({
        title: 'Logout Berhasil',
        description: 'Anda telah keluar dari akun Anda',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Gagal',
        description: 'Terjadi kesalahan saat logout',
        variant: 'destructive'
      });
    }
  }, []);

  // Single value object for the context provider
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
