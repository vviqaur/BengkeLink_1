
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Profile {
  id: string;
  role: 'customer' | 'technician' | 'workshop';
  name: string;
  username?: string;
  phone: string;
  profile_photo_url?: string;
  address?: string;
  date_of_birth?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface TechnicianProfile {
  id: string;
  workshop_name: string;
  partnership_number: string;
  id_number: string;
  id_photo_url: string;
  specialties?: string[];
  rating: number;
  review_count: number;
  is_available: boolean;
}

export interface WorkshopProfile {
  id: string;
  workshop_name: string;
  province: string;
  city: string;
  postal_code: string;
  detail_address: string;
  operating_hours: any;
  services: string[];
  vehicle_types: string[];
  technician_count: number;
  owner_name: string;
  business_number?: string;
  tax_number?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  is_approved: boolean;
  partnership_number?: string;
  rating: number;
  review_count: number;
}

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });
};

export const useTechnicianProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['technician-profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('technician_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as TechnicianProfile;
    },
    enabled: !!user && user.role === 'technician',
  });
};

export const useWorkshopProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['workshop-profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('workshop_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as WorkshopProfile;
    },
    enabled: !!user && user.role === 'workshop',
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updatedData: Partial<Profile>) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
