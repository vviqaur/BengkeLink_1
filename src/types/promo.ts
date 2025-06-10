
export interface Promo {
  id: string;
  title: string;
  description: string;
  image: string;
  discountType: 'percentage' | 'fixed' | 'bonus';
  discountValue: number;
  code: string;
  conditions: string[];
  expiryDate: Date;
  isActive: boolean;
  eligibility: {
    isNewUser?: boolean;
    minServiceCount?: number;
    minInviteCount?: number;
    allUsers?: boolean;
    dateRestriction?: Date;
  };
  claimedBy: string[];
}
