
export interface ServiceType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDuration: number;
}

export interface VehicleType {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: 'car' | 'motorcycle';
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  type: 'call_technician' | 'book_service';
  vehicleType: VehicleType;
  services: ServiceType[];
  problems: string[];
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  scheduledDate?: Date;
  status: 'pending' | 'accepted' | 'on_way' | 'in_progress' | 'completed' | 'cancelled';
  workshopId?: string;
  technicianId?: string;
  estimatedPrice: number;
  finalPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workshop {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  reviewCount: number;
  operatingHours: {
    [key: string]: string;
  };
  services: string[];
  technicians: Technician[];
  distance?: number;
  estimatedDuration?: number;
  photos?: string[];
}

export interface Technician {
  id: string;
  name: string;
  rating: number;
  completedServices: number;
  specialties: string[];
  profilePhoto?: string;
  isAvailable: boolean;
}

export interface PriceEstimation {
  servicePrice: number;
  partsPrice: number;
  platformFee: number;
  tax: number;
  discount: number;
  total: number;
  promoCode?: string;
}
