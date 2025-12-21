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
      family_assessments: {
        Row: {
          created_at: string
          id: string
          reflection_answers: Json | null
          section1_score: number
          section2_score: number
          section3_score: number
          section4_score: number
          total_score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reflection_answers?: Json | null
          section1_score?: number
          section2_score?: number
          section3_score?: number
          section4_score?: number
          total_score?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reflection_answers?: Json | null
          section1_score?: number
          section2_score?: number
          section3_score?: number
          section4_score?: number
          total_score?: number
          user_id?: string
        }
        Relationships: []
      }
      family_boundary_worksheets: {
        Row: {
          boundary_statement: string | null
          calm_response: string | null
          consequence_about_me: boolean | null
          consequence_consistent: boolean | null
          consequence_willing: boolean | null
          created_at: string
          id: string
          impact_emotional: string | null
          impact_family: string | null
          impact_finances: string | null
          impact_safety: string | null
          mindset_difficulties: string[] | null
          mindset_emotion: string | null
          mindset_other: string | null
          mindset_past_limits: string | null
          problem_behavior: string | null
          problem_frequency: string | null
          pushback_fears: string | null
          pushback_responses: string[] | null
          revised_boundary: string | null
          signed: boolean | null
          signed_at: string | null
          support_methods: string[] | null
          support_person: string | null
          user_id: string
          warning_signs: string | null
        }
        Insert: {
          boundary_statement?: string | null
          calm_response?: string | null
          consequence_about_me?: boolean | null
          consequence_consistent?: boolean | null
          consequence_willing?: boolean | null
          created_at?: string
          id?: string
          impact_emotional?: string | null
          impact_family?: string | null
          impact_finances?: string | null
          impact_safety?: string | null
          mindset_difficulties?: string[] | null
          mindset_emotion?: string | null
          mindset_other?: string | null
          mindset_past_limits?: string | null
          problem_behavior?: string | null
          problem_frequency?: string | null
          pushback_fears?: string | null
          pushback_responses?: string[] | null
          revised_boundary?: string | null
          signed?: boolean | null
          signed_at?: string | null
          support_methods?: string[] | null
          support_person?: string | null
          user_id: string
          warning_signs?: string | null
        }
        Update: {
          boundary_statement?: string | null
          calm_response?: string | null
          consequence_about_me?: boolean | null
          consequence_consistent?: boolean | null
          consequence_willing?: boolean | null
          created_at?: string
          id?: string
          impact_emotional?: string | null
          impact_family?: string | null
          impact_finances?: string | null
          impact_safety?: string | null
          mindset_difficulties?: string[] | null
          mindset_emotion?: string | null
          mindset_other?: string | null
          mindset_past_limits?: string | null
          problem_behavior?: string | null
          problem_frequency?: string | null
          pushback_fears?: string | null
          pushback_responses?: string[] | null
          revised_boundary?: string | null
          signed?: boolean | null
          signed_at?: string | null
          support_methods?: string[] | null
          support_person?: string | null
          user_id?: string
          warning_signs?: string | null
        }
        Relationships: []
      }
      family_control_worksheets: {
        Row: {
          created_at: string
          id: string
          part1_managing: string | null
          part1_stress: string | null
          part1_wellbeing: string | null
          part2_examples: Json | null
          part2_reflection_cost: string | null
          part2_reflection_hardest: string | null
          part3_examples: Json | null
          part3_reflection: string | null
          part4_shifts: Json | null
          part5_boundary: string | null
          part5_start_doing: string | null
          part5_stop_doing: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          part1_managing?: string | null
          part1_stress?: string | null
          part1_wellbeing?: string | null
          part2_examples?: Json | null
          part2_reflection_cost?: string | null
          part2_reflection_hardest?: string | null
          part3_examples?: Json | null
          part3_reflection?: string | null
          part4_shifts?: Json | null
          part5_boundary?: string | null
          part5_start_doing?: string | null
          part5_stop_doing?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          part1_managing?: string | null
          part1_stress?: string | null
          part1_wellbeing?: string | null
          part2_examples?: Json | null
          part2_reflection_cost?: string | null
          part2_reflection_hardest?: string | null
          part3_examples?: Json | null
          part3_reflection?: string | null
          part4_shifts?: Json | null
          part5_boundary?: string | null
          part5_start_doing?: string | null
          part5_stop_doing?: string | null
          user_id?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_post_id: string | null
          title: string | null
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_post_id?: string | null
          title?: string | null
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_post_id?: string | null
          title?: string | null
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      member_warnings: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          member_id: string
          moderator_id: string
          post_content: string | null
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          warning_type: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          member_id: string
          moderator_id: string
          post_content?: string | null
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          warning_type: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          member_id?: string
          moderator_id?: string
          post_content?: string | null
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          warning_type?: string
        }
        Relationships: []
      }
      private_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile_private: {
        Row: {
          created_at: string
          email: string
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          phone_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agreed_to_code_of_conduct: boolean | null
          code_of_conduct_agreed_at: string | null
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          updated_at: string | null
          username: string | null
          webinar_reminders_opted_in: boolean | null
        }
        Insert: {
          agreed_to_code_of_conduct?: boolean | null
          code_of_conduct_agreed_at?: string | null
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          updated_at?: string | null
          username?: string | null
          webinar_reminders_opted_in?: boolean | null
        }
        Update: {
          agreed_to_code_of_conduct?: boolean | null
          code_of_conduct_agreed_at?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string | null
          username?: string | null
          webinar_reminders_opted_in?: boolean | null
        }
        Relationships: []
      }
      provider_clicks: {
        Row: {
          city: string | null
          click_type: string
          clicked_at: string
          country: string | null
          id: string
          provider_id: string
          referrer: string | null
          region: string | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          city?: string | null
          click_type?: string
          clicked_at?: string
          country?: string | null
          id?: string
          provider_id: string
          referrer?: string | null
          region?: string | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          city?: string | null
          click_type?: string
          clicked_at?: string
          country?: string | null
          id?: string
          provider_id?: string
          referrer?: string | null
          region?: string | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_clicks_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_clicks_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_submissions: {
        Row: {
          accepts_mat_residents: boolean | null
          address: string | null
          adolescent_services: boolean | null
          also_provides_outpatient: boolean | null
          also_provides_sober_living: boolean | null
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
          parent_submission_id: string | null
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
          also_provides_outpatient?: boolean | null
          also_provides_sober_living?: boolean | null
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
          parent_submission_id?: string | null
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
          also_provides_outpatient?: boolean | null
          also_provides_sober_living?: boolean | null
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
          parent_submission_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "provider_submissions_parent_submission_id_fkey"
            columns: ["parent_submission_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_submissions_parent_submission_id_fkey"
            columns: ["parent_submission_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions_public"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "provider_subscriptions_provider_submission_id_fkey"
            columns: ["provider_submission_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions_public"
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
      provider_click_analytics: {
        Row: {
          card_views: number | null
          category: string | null
          city: string | null
          clicks_last_30_days: number | null
          clicks_last_7_days: number | null
          email_clicks: number | null
          first_click: string | null
          last_click: string | null
          phone_clicks: number | null
          provider_id: string | null
          provider_name: string | null
          state: string | null
          total_clicks: number | null
          unique_visitors: number | null
          website_clicks: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_clicks_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_clicks_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_submissions_public: {
        Row: {
          accepts_mat_residents: boolean | null
          address: string | null
          adolescent_services: boolean | null
          also_provides_outpatient: boolean | null
          also_provides_sober_living: boolean | null
          awake_staff_24_7: boolean | null
          case_management_services: boolean | null
          category: string | null
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
          facebook_url: string | null
          faith_based_services: boolean | null
          gender_specific_treatment: string[] | null
          has_valid_passport: boolean | null
          hourly_coaching_rate: string | null
          hourly_coaching_sessions: boolean | null
          house_meetings_per_week: number | null
          id: string | null
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
          parent_submission_id: string | null
          provider_name: string | null
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
          also_provides_outpatient?: boolean | null
          also_provides_sober_living?: boolean | null
          awake_staff_24_7?: boolean | null
          case_management_services?: boolean | null
          category?: string | null
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
          facebook_url?: string | null
          faith_based_services?: boolean | null
          gender_specific_treatment?: string[] | null
          has_valid_passport?: boolean | null
          hourly_coaching_rate?: string | null
          hourly_coaching_sessions?: boolean | null
          house_meetings_per_week?: number | null
          id?: string | null
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
          parent_submission_id?: string | null
          provider_name?: string | null
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
          also_provides_outpatient?: boolean | null
          also_provides_sober_living?: boolean | null
          awake_staff_24_7?: boolean | null
          case_management_services?: boolean | null
          category?: string | null
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
          facebook_url?: string | null
          faith_based_services?: boolean | null
          gender_specific_treatment?: string[] | null
          has_valid_passport?: boolean | null
          hourly_coaching_rate?: string | null
          hourly_coaching_sessions?: boolean | null
          house_meetings_per_week?: number | null
          id?: string | null
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
          parent_submission_id?: string | null
          provider_name?: string | null
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
        Relationships: [
          {
            foreignKeyName: "provider_submissions_parent_submission_id_fkey"
            columns: ["parent_submission_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_submissions_parent_submission_id_fkey"
            columns: ["parent_submission_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions_public"
            referencedColumns: ["id"]
          },
        ]
      }
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
          {
            foreignKeyName: "provider_subscriptions_provider_submission_id_fkey"
            columns: ["provider_submission_id"]
            isOneToOne: false
            referencedRelation: "provider_submissions_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_my_provider_subscriptions_with_provider: {
        Args: never
        Returns: {
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
        }[]
        SetofOptions: {
          from: "*"
          to: "provider_subscriptions_with_provider"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_provider_click_analytics_admin: {
        Args: never
        Returns: {
          card_views: number | null
          category: string | null
          city: string | null
          clicks_last_30_days: number | null
          clicks_last_7_days: number | null
          email_clicks: number | null
          first_click: string | null
          last_click: string | null
          phone_clicks: number | null
          provider_id: string | null
          provider_name: string | null
          state: string | null
          total_clicks: number | null
          unique_visitors: number | null
          website_clicks: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "provider_click_analytics"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_provider_subscriptions_with_provider_admin: {
        Args: never
        Returns: {
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
        }[]
        SetofOptions: {
          from: "*"
          to: "provider_subscriptions_with_provider"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_public_profiles: {
        Args: { _user_ids: string[] }
        Returns: {
          first_name: string
          id: string
          last_name: string
          username: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_active_family_member: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "moderator"
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
      app_role: ["admin", "user", "moderator"],
    },
  },
} as const
