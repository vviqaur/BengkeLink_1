
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Workshop {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  operating_hours: any;
  services: string[] | null;
  rating: number | null;
  review_count: number | null;
  image_url: string | null;
  is_active: boolean | null;
  // Add computed properties for UI
  distance?: string;
  estimatedTime?: string;
  operatingHours?: string;
  technicians: Array<{
    id: string;
    name: string;
    phone: string | null;
    specialties: string[] | null;
    rating: number | null;
    review_count: number | null;
    is_available: boolean | null;
  }>;
}

export const useWorkshops = () => {
  return useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      const { data: workshops, error: workshopsError } = await supabase
        .from('workshops')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (workshopsError) throw workshopsError;

      const { data: technicians, error: techniciansError } = await supabase
        .from('technicians')
        .select('*')
        .eq('is_available', true);

      if (techniciansError) throw techniciansError;

      // Group technicians by workshop
      const workshopsWithTechnicians = workshops?.map(workshop => ({
        ...workshop,
        image: workshop.image_url || '/placeholder.svg',
        distance: '1.2 km', // This would be calculated based on user location
        estimatedTime: '15 menit', // This would be calculated based on distance
        operatingHours: getOperatingHoursText(workshop.operating_hours),
        technicians: technicians?.filter(tech => tech.workshop_id === workshop.id) || []
      })) || [];

      return workshopsWithTechnicians;
    },
  });
};

const getOperatingHoursText = (operatingHours: any): string => {
  if (!operatingHours) return '08:00 - 18:00';
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[new Date().getDay()];
  
  return operatingHours[currentDay] || '08:00 - 18:00';
};
