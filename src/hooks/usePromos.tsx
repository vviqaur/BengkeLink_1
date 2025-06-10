
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Promo {
  id: string;
  title: string;
  description: string;
  poster_image_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  terms_conditions?: string[];
  expiry_date: string;
  eligibility_criteria?: any;
  promo_code?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserPromoClaim {
  id: string;
  user_id: string;
  promo_id: string;
  claimed_at: string;
  used_at?: string;
  is_used: boolean;
  promo?: Promo;
}

export const usePromos = () => {
  return useQuery({
    queryKey: ['promos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Promo[];
    },
  });
};

export const useUserPromoClaims = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-promo-claims', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('user_promo_claims')
        .select(`
          *,
          promo:promos(*)
        `)
        .eq('user_id', user.id)
        .order('claimed_at', { ascending: false });

      if (error) throw error;
      return data as UserPromoClaim[];
    },
    enabled: !!user,
  });
};

export const useClaimPromo = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (promoId: string) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('user_promo_claims')
        .insert({
          user_id: user.id,
          promo_id: promoId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-promo-claims'] });
    },
  });
};
