export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_submissions: {
        Row: {
          accepts_mat_residents: boolean | null
          address: string | null
          adolescent_services: boolean | null
          awake_staff_24_7: boolean | null
          case_management_services: boolean | null
          category: string
          chores_required: boolean | null
          cip_certified: boolean | null
          city: string | null
          co_occurring_diagnoses: string[] | null
          cost: string | null
          created_at: string | null
          curfew_time: string | null
          daily_companion_fee: string | null
          description_of_services: string | null
          detox_available: boolean | null
          detox_only_services: boolean | null
          email: string
          facebook_url: string | null
          faith_based_services: boolean | null
          gender_specific_treatment: string[] | null
          has_valid_passport: boolean | null
          hourly_coaching_rate: string | null
          hourly_coaching_sessions: boolean | null
          house_meetings_per_week: number | null
          id: string
          in_person_companion_work: boolean | null
          instagram_url: string | null
          insurances_accepted: string[] | null
          intervention_modalities: string[] | null
          items_included_in_cost: string[] | null
          job_assistance_provided: boolean | null
          languages_spoken: string[] | null
          legal_assistance_types: string[] | null
          length_of_services: string | null
          lgbt_supportive: boolean | null
          license_current_good_standing: boolean | null
          logo_url: string | null
          mandatory_curfew: boolean | null
          mandatory_house_meetings: boolean | null
          medication_administration: string | null
          military_first_responder_care: boolean | null
          minimum_time_since_last_use: string | null
          phone_number: string
          provider_name: string
          recovery_fellowships: string[] | null
          required_meetings_per_week: string | null
          residents_expected_to_work: boolean | null
          sliding_scale_available: boolean | null
          state: string | null
          status: string | null
          submitted_by: string | null
          substance_use_disorder_experience: boolean | null
          telehealth_available: boolean | null
          therapeutic_modalities: string[] | null
          tiktok_url: string | null
          total_treatment_beds: number | null
          travel_expenses_included: boolean | null
          updated_at: string | null
          website: string | null
          works_internationally: boolean | null
          works_nationally: boolean | null
          year_started: number | null
          youtube_url: string | null
          zip_code: string | null
        }
        Insert: {
          accepts_mat_residents?: boolean | null
          address?: string | null
          adolescent_services?: boolean | null
          awake_staff_24_7?: boolean | null
          case_management_services?: boolean | null
          category: string
          chores_required?: boolean | null
          cip_certified?: boolean | null
          city?: string | null
          co_occurring_diagnoses?: string[] | null
          cost?: string | null
          created_at?: string | null
          curfew_time?: string | null
          daily_companion_fee?: string | null
          description_of_services?: string | null
          detox_available?: boolean | null
          detox_only_services?: boolean | null
          email: string
          facebook_url?: string | null
          faith_based_services?: boolean | null
          gender_specific_treatment?: string[] | null
          has_valid_passport?: boolean | null
          hourly_coaching_rate?: string | null
          hourly_coaching_sessions?: boolean | null
          house_meetings_per_week?: number | null
          id?: string
          in_person_companion_work?: boolean | null
          instagram_url?: string | null
          insurances_accepted?: string[] | null
          intervention_modalities?: string[] | null
          items_included_in_cost?: string[] | null
          job_assistance_provided?: boolean | null
          languages_spoken?: string[] | null
          legal_assistance_types?: string[] | null
          length_of_services?: string | null
          lgbt_supportive?: boolean | null
          license_current_good_standing?: boolean | null
          logo_url?: string | null
          mandatory_curfew?: boolean | null
          mandatory_house_meetings?: boolean | null
          medication_administration?: string | null
          military_first_responder_care?: boolean | null
          minimum_time_since_last_use?: string | null
          phone_number: string
          provider_name: string
          recovery_fellowships?: string[] | null
          required_meetings_per_week?: string | null
          residents_expected_to_work?: boolean | null
          sliding_scale_available?: boolean | null
          state?: string | null
          status?: string | null
          submitted_by?: string | null
          substance_use_disorder_experience?: boolean | null
          telehealth_available?: boolean | null
          therapeutic_modalities?: string[] | null
          tiktok_url?: string | null
          total_treatment_beds?: number | null
          travel_expenses_included?: boolean | null
          updated_at?: string | null
          website?: string | null
          works_internationally?: boolean | null
          works_nationally?: boolean | null
          year_started?: number | null
          youtube_url?: string | null
          zip_code?: string | null
        }
        Update: {
          accepts_mat_residents?: boolean | null
          address?: string | null
          adolescent_services?: boolean | null
          awake_staff_24_7?: boolean | null
          case_management_services?: boolean | null
          category?: string
          chores_required?: boolean | null
          cip_certified?: boolean | null
          city?: string | null
          co_occurring_diagnoses?: string[] | null
          cost?: string | null
          created_at?: string | null
          curfew_time?: string | null
          daily_companion_fee?: string | null
          description_of_services?: string | null
          detox_available?: boolean | null
          detox_only_services?: boolean | null
          email?: string
          facebook_url?: string | null
          faith_based_services?: boolean | null
          gender_specific_treatment?: string[] | null
          has_valid_passport?: boolean | null
          hourly_coaching_rate?: string | null
          hourly_coaching_sessions?: boolean | null
          house_meetings_per_week?: number | null
          id?: string
          in_person_companion_work?: boolean | null
          instagram_url?: string | null
          insurances_accepted?: string[] | null
          intervention_modalities?: string[] | null
          items_included_in_cost?: string[] | null
          job_assistance_provided?: boolean | null
          languages_spoken?: string[] | null
          legal_assistance_types?: string[] | null
          length_of_services?: string | null
          lgbt_supportive?: boolean | null
          license_current_good_standing?: boolean | null
          logo_url?: string | null
          mandatory_curfew?: boolean | null
          mandatory_house_meetings?: boolean | null
          medication_administration?: string | null
          military_first_responder_care?: boolean | null
          minimum_time_since_last_use?: string | null
          phone_number?: string
          provider_name?: string
          recovery_fellowships?: string[] | null
          required_meetings_per_week?: string | null
          residents_expected_to_work?: boolean | null
          sliding_scale_available?: boolean | null
          state?: string | null
          status?: string | null
          submitted_by?: string | null
          substance_use_disorder_experience?: boolean | null
          telehealth_available?: boolean | null
          therapeutic_modalities?: string[] | null
          tiktok_url?: string | null
          total_treatment_beds?: number | null
          travel_expenses_included?: boolean | null
          updated_at?: string | null
          website?: string | null
          works_internationally?: boolean | null
          works_nationally?: boolean | null
          year_started?: number | null
          youtube_url?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      provider_subscriptions: {
        Row: {
          amount: number
          created_at: string
          id: string
          next_billing_date: string | null
          paypal_subscription_id: string | null
          plan_type: string
          provider_submission_id: string | null
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          next_billing_date?: string | null
          paypal_subscription_id?: string | null
          plan_type: string
          provider_submission_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          next_billing_date?: string | null
          paypal_subscription_id?: string | null
          plan_type?: string
          provider_submission_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_subscriptions_provider_submission_id_fkey"
            columns: ["provider_submission_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      provider_subscriptions_with_provider: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string | null
          next_billing_date: string | null
          paypal_subscription_id: string | null
          plan_type: string | null
          provider_name: string | null
          provider_submission_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_subscriptions_provider_submission_id_fkey"
            columns: ["provider_submission_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
