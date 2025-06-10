import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface BookingData {
  workshop_id: string;
  technician_id?: string;
  booking_type: 'location' | 'workshop';
  vehicle_type: string;
  services: string[];
  problems?: string[];
  description?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  scheduled_date: string;
  scheduled_time: string;
  estimated_price?: number;
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (bookingData: BookingData) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          workshop:workshops(*),
          technician:technicians(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
