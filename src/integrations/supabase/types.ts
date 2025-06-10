export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_status_history: {
        Row: {
          booking_id: string | null
          changed_at: string
          changed_by: string | null
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          booking_id?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          booking_id?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_status_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_type: string
          created_at: string
          description: string | null
          estimated_price: number | null
          final_price: number | null
          id: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          payment_method: string | null
          payment_status: string | null
          problems: string[] | null
          scheduled_date: string
          scheduled_time: string
          services: string[]
          status: string
          technician_id: string | null
          updated_at: string
          user_id: string
          vehicle_type: string
          workshop_id: string
        }
        Insert: {
          booking_type: string
          created_at?: string
          description?: string | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          payment_method?: string | null
          payment_status?: string | null
          problems?: string[] | null
          scheduled_date: string
          scheduled_time: string
          services: string[]
          status?: string
          technician_id?: string | null
          updated_at?: string
          user_id: string
          vehicle_type: string
          workshop_id: string
        }
        Update: {
          booking_type?: string
          created_at?: string
          description?: string | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          payment_method?: string | null
          payment_status?: string | null
          problems?: string[] | null
          scheduled_date?: string
          scheduled_time?: string
          services?: string[]
          status?: string
          technician_id?: string | null
          updated_at?: string
          user_id?: string
          vehicle_type?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bookings_technician"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_workshop"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          message_type: string | null
          sender_id: string
          sender_type: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string | null
          sender_id: string
          sender_type: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string | null
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          date_of_birth: string | null
          id: string
          is_verified: boolean | null
          name: string
          phone: string
          profile_photo_url: string | null
          role: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          id: string
          is_verified?: boolean | null
          name: string
          phone: string
          profile_photo_url?: string | null
          role: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string
          phone?: string
          profile_photo_url?: string | null
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      promos: {
        Row: {
          created_at: string | null
          description: string
          discount_amount: number | null
          discount_percentage: number | null
          eligibility_criteria: Json | null
          expiry_date: string
          id: string
          is_active: boolean | null
          poster_image_url: string | null
          promo_code: string | null
          terms_conditions: string[] | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          discount_amount?: number | null
          discount_percentage?: number | null
          eligibility_criteria?: Json | null
          expiry_date: string
          id?: string
          is_active?: boolean | null
          poster_image_url?: string | null
          promo_code?: string | null
          terms_conditions?: string[] | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          eligibility_criteria?: Json | null
          expiry_date?: string
          id?: string
          is_active?: boolean | null
          poster_image_url?: string | null
          promo_code?: string | null
          terms_conditions?: string[] | null
          title?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          technician_id: string | null
          technician_rating: number | null
          technician_review: string | null
          user_id: string
          workshop_id: string | null
          workshop_rating: number | null
          workshop_review: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          technician_id?: string | null
          technician_rating?: number | null
          technician_review?: string | null
          user_id: string
          workshop_id?: string | null
          workshop_rating?: number | null
          workshop_review?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          technician_id?: string | null
          technician_rating?: number | null
          technician_review?: string | null
          user_id?: string
          workshop_id?: string | null
          workshop_rating?: number | null
          workshop_review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_profiles: {
        Row: {
          id: string
          id_number: string
          id_photo_url: string
          is_available: boolean | null
          partnership_number: string
          rating: number | null
          review_count: number | null
          specialties: string[] | null
          workshop_name: string
        }
        Insert: {
          id: string
          id_number: string
          id_photo_url: string
          is_available?: boolean | null
          partnership_number: string
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          workshop_name: string
        }
        Update: {
          id?: string
          id_number?: string
          id_photo_url?: string
          is_available?: boolean | null
          partnership_number?: string
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          workshop_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          created_at: string
          id: string
          is_available: boolean | null
          name: string
          phone: string | null
          rating: number | null
          review_count: number | null
          specialties: string[] | null
          updated_at: string
          workshop_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          name: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          updated_at?: string
          workshop_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          name?: string
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          updated_at?: string
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technicians_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      user_promo_claims: {
        Row: {
          claimed_at: string | null
          id: string
          is_used: boolean | null
          promo_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          id?: string
          is_used?: boolean | null
          promo_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          id?: string
          is_used?: boolean | null
          promo_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_promo_claims_promo_id_fkey"
            columns: ["promo_id"]
            isOneToOne: false
            referencedRelation: "promos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promo_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_profiles: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_name: string | null
          business_number: string | null
          city: string
          detail_address: string
          id: string
          is_approved: boolean | null
          operating_hours: Json
          owner_name: string
          partnership_number: string | null
          postal_code: string
          province: string
          rating: number | null
          review_count: number | null
          services: string[]
          tax_number: string | null
          technician_count: number
          vehicle_types: string[]
          workshop_name: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          business_number?: string | null
          city: string
          detail_address: string
          id: string
          is_approved?: boolean | null
          operating_hours: Json
          owner_name: string
          partnership_number?: string | null
          postal_code: string
          province: string
          rating?: number | null
          review_count?: number | null
          services: string[]
          tax_number?: string | null
          technician_count: number
          vehicle_types: string[]
          workshop_name: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          business_number?: string | null
          city?: string
          detail_address?: string
          id?: string
          is_approved?: boolean | null
          operating_hours?: Json
          owner_name?: string
          partnership_number?: string | null
          postal_code?: string
          province?: string
          rating?: number | null
          review_count?: number | null
          services?: string[]
          tax_number?: string | null
          technician_count?: number
          vehicle_types?: string[]
          workshop_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          address: string
          created_at: string
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: Json | null
          phone: string | null
          rating: number | null
          review_count: number | null
          services: string[] | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: Json | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          services?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: Json | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          services?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
