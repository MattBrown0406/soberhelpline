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
      provider_submissions: {
        Row: {
          accepts_mat_residents: boolean | null
          address: string | null
          awake_staff_24_7: boolean | null
          case_management_services: boolean | null
          category: string
          chores_required: boolean | null
          city: string | null
          co_occurring_diagnoses: string[] | null
          cost: string | null
          created_at: string | null
          curfew_time: string | null
          daily_companion_fee: string | null
          description_of_services: string | null
          detox_available: boolean | null
          email: string
          gender_specific_treatment: string[] | null
          has_valid_passport: boolean | null
          hourly_coaching_rate: string | null
          hourly_coaching_sessions: boolean | null
          house_meetings_per_week: number | null
          id: string
          in_person_companion_work: boolean | null
          insurances_accepted: string[] | null
          intervention_modalities: string[] | null
          items_included_in_cost: string[] | null
          job_assistance_provided: boolean | null
          legal_assistance_types: string[] | null
          length_of_services: string | null
          lgbt_supportive: boolean | null
          license_current_good_standing: boolean | null
          logo_url: string | null
          mandatory_curfew: boolean | null
          mandatory_house_meetings: boolean | null
          medication_administration: string | null
          minimum_time_since_last_use: string | null
          phone_number: string
          provider_name: string
          required_meetings_per_week: string | null
          residents_expected_to_work: boolean | null
          state: string | null
          status: string | null
          substance_use_disorder_experience: boolean | null
          therapeutic_modalities: string[] | null
          total_treatment_beds: number | null
          updated_at: string | null
          website: string | null
          year_started: number | null
          zip_code: string | null
        }
        Insert: {
          accepts_mat_residents?: boolean | null
          address?: string | null
          awake_staff_24_7?: boolean | null
          case_management_services?: boolean | null
          category: string
          chores_required?: boolean | null
          city?: string | null
          co_occurring_diagnoses?: string[] | null
          cost?: string | null
          created_at?: string | null
          curfew_time?: string | null
          daily_companion_fee?: string | null
          description_of_services?: string | null
          detox_available?: boolean | null
          email: string
          gender_specific_treatment?: string[] | null
          has_valid_passport?: boolean | null
          hourly_coaching_rate?: string | null
          hourly_coaching_sessions?: boolean | null
          house_meetings_per_week?: number | null
          id?: string
          in_person_companion_work?: boolean | null
          insurances_accepted?: string[] | null
          intervention_modalities?: string[] | null
          items_included_in_cost?: string[] | null
          job_assistance_provided?: boolean | null
          legal_assistance_types?: string[] | null
          length_of_services?: string | null
          lgbt_supportive?: boolean | null
          license_current_good_standing?: boolean | null
          logo_url?: string | null
          mandatory_curfew?: boolean | null
          mandatory_house_meetings?: boolean | null
          medication_administration?: string | null
          minimum_time_since_last_use?: string | null
          phone_number: string
          provider_name: string
          required_meetings_per_week?: string | null
          residents_expected_to_work?: boolean | null
          state?: string | null
          status?: string | null
          substance_use_disorder_experience?: boolean | null
          therapeutic_modalities?: string[] | null
          total_treatment_beds?: number | null
          updated_at?: string | null
          website?: string | null
          year_started?: number | null
          zip_code?: string | null
        }
        Update: {
          accepts_mat_residents?: boolean | null
          address?: string | null
          awake_staff_24_7?: boolean | null
          case_management_services?: boolean | null
          category?: string
          chores_required?: boolean | null
          city?: string | null
          co_occurring_diagnoses?: string[] | null
          cost?: string | null
          created_at?: string | null
          curfew_time?: string | null
          daily_companion_fee?: string | null
          description_of_services?: string | null
          detox_available?: boolean | null
          email?: string
          gender_specific_treatment?: string[] | null
          has_valid_passport?: boolean | null
          hourly_coaching_rate?: string | null
          hourly_coaching_sessions?: boolean | null
          house_meetings_per_week?: number | null
          id?: string
          in_person_companion_work?: boolean | null
          insurances_accepted?: string[] | null
          intervention_modalities?: string[] | null
          items_included_in_cost?: string[] | null
          job_assistance_provided?: boolean | null
          legal_assistance_types?: string[] | null
          length_of_services?: string | null
          lgbt_supportive?: boolean | null
          license_current_good_standing?: boolean | null
          logo_url?: string | null
          mandatory_curfew?: boolean | null
          mandatory_house_meetings?: boolean | null
          medication_administration?: string | null
          minimum_time_since_last_use?: string | null
          phone_number?: string
          provider_name?: string
          required_meetings_per_week?: string | null
          residents_expected_to_work?: boolean | null
          state?: string | null
          status?: string | null
          substance_use_disorder_experience?: boolean | null
          therapeutic_modalities?: string[] | null
          total_treatment_beds?: number | null
          updated_at?: string | null
          website?: string | null
          year_started?: number | null
          zip_code?: string | null
        }
        Relationships: []
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
      [_ in never]: never
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
