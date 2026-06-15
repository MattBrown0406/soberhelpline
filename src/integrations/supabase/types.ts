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
      abandoned_bookings: {
        Row: {
          client_email: string
          client_name: string | null
          client_phone: string | null
          completed: boolean
          created_at: string
          followup_sent_at: string | null
          id: string
          last_step: number | null
          plan_type: string | null
          provider_id: string | null
          provider_name: string | null
          selected_date: string | null
          selected_time: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_email: string
          client_name?: string | null
          client_phone?: string | null
          completed?: boolean
          created_at?: string
          followup_sent_at?: string | null
          id?: string
          last_step?: number | null
          plan_type?: string | null
          provider_id?: string | null
          provider_name?: string | null
          selected_date?: string | null
          selected_time?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_email?: string
          client_name?: string | null
          client_phone?: string | null
          completed?: boolean
          created_at?: string
          followup_sent_at?: string | null
          id?: string
          last_step?: number | null
          plan_type?: string | null
          provider_id?: string | null
          provider_name?: string | null
          selected_date?: string | null
          selected_time?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      boundary_clarity_worksheets: {
        Row: {
          boundary_about_me: boolean | null
          boundary_clear: boolean | null
          boundary_enforceable: boolean | null
          boundary_specific: boolean | null
          boundary_statement: string | null
          coaching_phase: string | null
          communication_script: string | null
          created_at: string
          enforcement_avoid_arguing: boolean | null
          enforcement_follow_through: boolean | null
          enforcement_repeat_once: boolean | null
          enforcement_seek_support: boolean | null
          enforcement_stay_calm: boolean | null
          fear_emotional_or_factual: string | null
          fear_other: string | null
          fear_sentence: string | null
          fears: string[] | null
          final_consequence: string | null
          financial_acting_from_fear: boolean | null
          financial_aligns_values: boolean | null
          financial_give_without_addiction: boolean | null
          financial_removes_consequence: boolean | null
          first_violation_response: string | null
          id: string
          most_violated_value: string | null
          problem_behavior: string | null
          second_violation_response: string | null
          self_reflection: string | null
          unity_resolution: string | null
          unity_status: string | null
          updated_at: string
          user_id: string
          values_list: string[] | null
          willing_to_follow_through: string | null
        }
        Insert: {
          boundary_about_me?: boolean | null
          boundary_clear?: boolean | null
          boundary_enforceable?: boolean | null
          boundary_specific?: boolean | null
          boundary_statement?: string | null
          coaching_phase?: string | null
          communication_script?: string | null
          created_at?: string
          enforcement_avoid_arguing?: boolean | null
          enforcement_follow_through?: boolean | null
          enforcement_repeat_once?: boolean | null
          enforcement_seek_support?: boolean | null
          enforcement_stay_calm?: boolean | null
          fear_emotional_or_factual?: string | null
          fear_other?: string | null
          fear_sentence?: string | null
          fears?: string[] | null
          final_consequence?: string | null
          financial_acting_from_fear?: boolean | null
          financial_aligns_values?: boolean | null
          financial_give_without_addiction?: boolean | null
          financial_removes_consequence?: boolean | null
          first_violation_response?: string | null
          id?: string
          most_violated_value?: string | null
          problem_behavior?: string | null
          second_violation_response?: string | null
          self_reflection?: string | null
          unity_resolution?: string | null
          unity_status?: string | null
          updated_at?: string
          user_id: string
          values_list?: string[] | null
          willing_to_follow_through?: string | null
        }
        Update: {
          boundary_about_me?: boolean | null
          boundary_clear?: boolean | null
          boundary_enforceable?: boolean | null
          boundary_specific?: boolean | null
          boundary_statement?: string | null
          coaching_phase?: string | null
          communication_script?: string | null
          created_at?: string
          enforcement_avoid_arguing?: boolean | null
          enforcement_follow_through?: boolean | null
          enforcement_repeat_once?: boolean | null
          enforcement_seek_support?: boolean | null
          enforcement_stay_calm?: boolean | null
          fear_emotional_or_factual?: string | null
          fear_other?: string | null
          fear_sentence?: string | null
          fears?: string[] | null
          final_consequence?: string | null
          financial_acting_from_fear?: boolean | null
          financial_aligns_values?: boolean | null
          financial_give_without_addiction?: boolean | null
          financial_removes_consequence?: boolean | null
          first_violation_response?: string | null
          id?: string
          most_violated_value?: string | null
          problem_behavior?: string | null
          second_violation_response?: string | null
          self_reflection?: string | null
          unity_resolution?: string | null
          unity_status?: string | null
          updated_at?: string
          user_id?: string
          values_list?: string[] | null
          willing_to_follow_through?: string | null
        }
        Relationships: []
      }
      coaching_intake_assessments: {
        Row: {
          anxiety_level: string | null
          arguments_strain: string | null
          assigned_phase: string | null
          coaching_goal_other: string | null
          coaching_goals: string[] | null
          confidence_change: number | null
          conflict_frequency: number | null
          created_at: string
          current_status: string | null
          decision_makers_aligned: string | null
          emotionally_exhausted: string | null
          enabling_behaviors: string[] | null
          family_members_list: string | null
          feel_safe: string | null
          financial_risks: string[] | null
          history_details: string | null
          history_overdose: string | null
          history_suicidal: string | null
          history_violence: string | null
          household_stress_level: number | null
          id: string
          loved_one_age: string | null
          most_urgent: string | null
          multiple_family_members: boolean | null
          outside_support: string | null
          overdose_date: string | null
          primary_contact_name: string | null
          readiness_enforce_boundaries: number | null
          readiness_stop_rescuing: number | null
          relationship_other: string | null
          relationship_to_loved_one: string | null
          risk_indicators: string[] | null
          sleep_quality: string | null
          substance_other: string | null
          substances: string[] | null
          unified_approach: string | null
          updated_at: string
          user_id: string
          written_boundaries: string | null
        }
        Insert: {
          anxiety_level?: string | null
          arguments_strain?: string | null
          assigned_phase?: string | null
          coaching_goal_other?: string | null
          coaching_goals?: string[] | null
          confidence_change?: number | null
          conflict_frequency?: number | null
          created_at?: string
          current_status?: string | null
          decision_makers_aligned?: string | null
          emotionally_exhausted?: string | null
          enabling_behaviors?: string[] | null
          family_members_list?: string | null
          feel_safe?: string | null
          financial_risks?: string[] | null
          history_details?: string | null
          history_overdose?: string | null
          history_suicidal?: string | null
          history_violence?: string | null
          household_stress_level?: number | null
          id?: string
          loved_one_age?: string | null
          most_urgent?: string | null
          multiple_family_members?: boolean | null
          outside_support?: string | null
          overdose_date?: string | null
          primary_contact_name?: string | null
          readiness_enforce_boundaries?: number | null
          readiness_stop_rescuing?: number | null
          relationship_other?: string | null
          relationship_to_loved_one?: string | null
          risk_indicators?: string[] | null
          sleep_quality?: string | null
          substance_other?: string | null
          substances?: string[] | null
          unified_approach?: string | null
          updated_at?: string
          user_id: string
          written_boundaries?: string | null
        }
        Update: {
          anxiety_level?: string | null
          arguments_strain?: string | null
          assigned_phase?: string | null
          coaching_goal_other?: string | null
          coaching_goals?: string[] | null
          confidence_change?: number | null
          conflict_frequency?: number | null
          created_at?: string
          current_status?: string | null
          decision_makers_aligned?: string | null
          emotionally_exhausted?: string | null
          enabling_behaviors?: string[] | null
          family_members_list?: string | null
          feel_safe?: string | null
          financial_risks?: string[] | null
          history_details?: string | null
          history_overdose?: string | null
          history_suicidal?: string | null
          history_violence?: string | null
          household_stress_level?: number | null
          id?: string
          loved_one_age?: string | null
          most_urgent?: string | null
          multiple_family_members?: boolean | null
          outside_support?: string | null
          overdose_date?: string | null
          primary_contact_name?: string | null
          readiness_enforce_boundaries?: number | null
          readiness_stop_rescuing?: number | null
          relationship_other?: string | null
          relationship_to_loved_one?: string | null
          risk_indicators?: string[] | null
          sleep_quality?: string | null
          substance_other?: string | null
          substances?: string[] | null
          unified_approach?: string | null
          updated_at?: string
          user_id?: string
          written_boundaries?: string | null
        }
        Relationships: []
      }
      coaching_plans: {
        Row: {
          client_user_id: string
          completed_sessions: number
          created_at: string
          id: string
          plan_type: string
          provider_id: string
          provider_payout_per_session: number
          status: string
          total_amount: number
          total_sessions: number
          updated_at: string
        }
        Insert: {
          client_user_id: string
          completed_sessions?: number
          created_at?: string
          id?: string
          plan_type: string
          provider_id: string
          provider_payout_per_session: number
          status?: string
          total_amount: number
          total_sessions?: number
          updated_at?: string
        }
        Update: {
          client_user_id?: string
          completed_sessions?: number
          created_at?: string
          id?: string
          plan_type?: string
          provider_id?: string
          provider_payout_per_session?: number
          status?: string
          total_amount?: number
          total_sessions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaching_plans_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_plans_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_bookings: {
        Row: {
          amount_paid: number
          booking_date: string
          client_email: string
          client_name: string
          client_notified: boolean | null
          client_phone: string | null
          client_user_id: string | null
          coaching_plan_id: string | null
          created_at: string
          end_time: string
          id: string
          intake_responses: Json | null
          paypal_order_id: string | null
          provider_id: string
          provider_notified: boolean | null
          start_time: string
          status: string
          timezone: string
          updated_at: string
          zoom_meeting_id: string | null
          zoom_meeting_url: string | null
          zoom_passcode: string | null
        }
        Insert: {
          amount_paid?: number
          booking_date: string
          client_email: string
          client_name: string
          client_notified?: boolean | null
          client_phone?: string | null
          client_user_id?: string | null
          coaching_plan_id?: string | null
          created_at?: string
          end_time: string
          id?: string
          intake_responses?: Json | null
          paypal_order_id?: string | null
          provider_id: string
          provider_notified?: boolean | null
          start_time: string
          status?: string
          timezone?: string
          updated_at?: string
          zoom_meeting_id?: string | null
          zoom_meeting_url?: string | null
          zoom_passcode?: string | null
        }
        Update: {
          amount_paid?: number
          booking_date?: string
          client_email?: string
          client_name?: string
          client_notified?: boolean | null
          client_phone?: string | null
          client_user_id?: string | null
          coaching_plan_id?: string | null
          created_at?: string
          end_time?: string
          id?: string
          intake_responses?: Json | null
          paypal_order_id?: string | null
          provider_id?: string
          provider_notified?: boolean | null
          start_time?: string
          status?: string
          timezone?: string
          updated_at?: string
          zoom_meeting_id?: string | null
          zoom_meeting_url?: string | null
          zoom_passcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_bookings_coaching_plan_id_fkey"
            columns: ["coaching_plan_id"]
            isOneToOne: false
            referencedRelation: "coaching_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_payouts: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          error_message: string | null
          id: string
          paypal_payout_id: string | null
          processed_at: string | null
          provider_id: string
          status: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          paypal_payout_id?: string | null
          processed_at?: string | null
          provider_id: string
          status?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          paypal_payout_id?: string | null
          processed_at?: string | null
          provider_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_payouts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "consultation_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_payouts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_payouts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_providers: {
        Row: {
          bio: string | null
          created_at: string
          full_name: string
          id: string
          notification_email: string | null
          paypal_email: string
          photo_url: string | null
          session_duration_minutes: number
          session_rate: number
          specialties: string[] | null
          status: string
          timezone: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          full_name: string
          id?: string
          notification_email?: string | null
          paypal_email: string
          photo_url?: string | null
          session_duration_minutes?: number
          session_rate?: number
          specialties?: string[] | null
          status?: string
          timezone?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          notification_email?: string | null
          paypal_email?: string
          photo_url?: string | null
          session_duration_minutes?: number
          session_rate?: number
          specialties?: string[] | null
          status?: string
          timezone?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversion_events: {
        Row: {
          created_at: string
          event_name: string
          first_landing_path: string | null
          id: string
          label: string | null
          metadata: Json
          page_path: string | null
          page_title: string | null
          referrer: string | null
          source: string | null
          target_href: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          first_landing_path?: string | null
          id?: string
          label?: string | null
          metadata?: Json
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          source?: string | null
          target_href?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          first_landing_path?: string | null
          id?: string
          label?: string | null
          metadata?: Json
          page_path?: string | null
          page_title?: string | null
          referrer?: string | null
          source?: string | null
          target_href?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      education_bookmarks: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          resource_name: string
          resource_path: string
          resource_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          resource_name: string
          resource_path: string
          resource_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          resource_name?: string
          resource_path?: string
          resource_type?: string
          user_id?: string
        }
        Relationships: []
      }
      education_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          progress_percentage: number | null
          resource_name: string
          resource_path: string
          resource_type: string
          status: string
          time_spent_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress_percentage?: number | null
          resource_name: string
          resource_path: string
          resource_type: string
          status?: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress_percentage?: number | null
          resource_name?: string
          resource_path?: string
          resource_type?: string
          status?: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_suppression_list: {
        Row: {
          added_by: string | null
          created_at: string
          email: string
          id: string
          reason: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          email: string
          id?: string
          reason?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string
          email?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      enabling_behavior_audits: {
        Row: {
          answers: Json
          consequence_score: number | null
          control_score: number | null
          created_at: string
          emotional_score: number | null
          financial_score: number | null
          id: string
          risk_level: string | null
          self_neglect_score: number | null
          total_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          consequence_score?: number | null
          control_score?: number | null
          created_at?: string
          emotional_score?: number | null
          financial_score?: number | null
          id?: string
          risk_level?: string | null
          self_neglect_score?: number | null
          total_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          consequence_score?: number | null
          control_score?: number | null
          created_at?: string
          emotional_score?: number | null
          financial_score?: number | null
          id?: string
          risk_level?: string | null
          self_neglect_score?: number | null
          total_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      family_readiness_assessments: {
        Row: {
          alignment_score: number | null
          answers: Json
          boundary_score: number | null
          created_at: string
          emotional_score: number | null
          enabling_score: number | null
          id: string
          phase: string | null
          total_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          alignment_score?: number | null
          answers?: Json
          boundary_score?: number | null
          created_at?: string
          emotional_score?: number | null
          enabling_score?: number | null
          id?: string
          phase?: string | null
          total_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          alignment_score?: number | null
          answers?: Json
          boundary_score?: number | null
          created_at?: string
          emotional_score?: number | null
          enabling_score?: number | null
          id?: string
          phase?: string | null
          total_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      family_squares_followup_queue: {
        Row: {
          body_html: string
          created_at: string
          email: string
          error_message: string | null
          id: string
          lead_tier: string
          name: string | null
          registration_id: string | null
          revenue_path: string
          scheduled_for: string
          sent_at: string | null
          sequence_step: number
          skipped_at: string | null
          subject: string
        }
        Insert: {
          body_html: string
          created_at?: string
          email: string
          error_message?: string | null
          id?: string
          lead_tier?: string
          name?: string | null
          registration_id?: string | null
          revenue_path?: string
          scheduled_for: string
          sent_at?: string | null
          sequence_step: number
          skipped_at?: string | null
          subject: string
        }
        Update: {
          body_html?: string
          created_at?: string
          email?: string
          error_message?: string | null
          id?: string
          lead_tier?: string
          name?: string | null
          registration_id?: string | null
          revenue_path?: string
          scheduled_for?: string
          sent_at?: string | null
          sequence_step?: number
          skipped_at?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_squares_followup_queue_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "zoom_meeting_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_badges: {
        Row: {
          color: string
          created_at: string
          criteria_type: string
          criteria_value: number | null
          description: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          criteria_type: string
          criteria_value?: number | null
          description: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          criteria_type?: string
          criteria_value?: number | null
          description?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      forum_bookmarks: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_daily_prompts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_used_at: string | null
          prompt_text: string
          topic_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          prompt_text: string
          topic_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          prompt_text?: string
          topic_id?: string
        }
        Relationships: []
      }
      forum_member_spotlights: {
        Row: {
          created_at: string
          id: string
          month: string
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          month: string
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          month?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      forum_mentions: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          mentioned_user_id: string
          mentioning_user_id: string
          post_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          mentioned_user_id: string
          mentioning_user_id: string
          post_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          mentioned_user_id?: string
          mentioning_user_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_mentions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_mentions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_poll_options: {
        Row: {
          created_at: string
          display_order: number
          id: string
          option_text: string
          poll_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          option_text: string
          poll_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          option_text?: string
          poll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "forum_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_poll_votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "forum_poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "forum_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_polls: {
        Row: {
          allows_multiple: boolean
          created_at: string
          ends_at: string | null
          id: string
          post_id: string
          question: string
        }
        Insert: {
          allows_multiple?: boolean
          created_at?: string
          ends_at?: string | null
          id?: string
          post_id: string
          question: string
        }
        Update: {
          allows_multiple?: boolean
          created_at?: string
          ends_at?: string | null
          id?: string
          post_id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "forum_posts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_post_drafts: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          parent_post_id: string | null
          title: string | null
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
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
          is_anonymous?: boolean
          parent_post_id?: string | null
          title?: string | null
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_post_drafts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_post_drafts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          is_pinned: boolean
          needs_support: boolean
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
          is_anonymous?: boolean
          is_pinned?: boolean
          needs_support?: boolean
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
          is_anonymous?: boolean
          is_pinned?: boolean
          needs_support?: boolean
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
          {
            foreignKeyName: "forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topic_follows: {
        Row: {
          created_at: string
          id: string
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: []
      }
      guide_views: {
        Row: {
          guide_name: string
          guide_path: string
          id: string
          session_id: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          guide_name: string
          guide_path: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          guide_name?: string
          guide_path?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          is_private: boolean
          mood: string | null
          related_resource_name: string | null
          related_resource_path: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_private?: boolean
          mood?: string | null
          related_resource_name?: string | null
          related_resource_path?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean
          mood?: string | null
          related_resource_name?: string | null
          related_resource_path?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meeting_blocklist: {
        Row: {
          blocked_last_name: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          notes: string | null
          reason: string | null
          updated_at: string
        }
        Insert: {
          blocked_last_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          updated_at?: string
        }
        Update: {
          blocked_last_name?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          updated_at?: string
        }
        Relationships: []
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
      pending_consultation_orders: {
        Row: {
          booking_payload: Json
          created_at: string | null
          id: string
          paypal_order_id: string | null
          status: string | null
        }
        Insert: {
          booking_payload: Json
          created_at?: string | null
          id?: string
          paypal_order_id?: string | null
          status?: string | null
        }
        Update: {
          booking_payload?: Json
          created_at?: string | null
          id?: string
          paypal_order_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      pending_free_memberships: {
        Row: {
          claimed_at: string | null
          created_at: string
          email: string
          id: string
          invited_by: string | null
          status: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          status?: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          status?: string
        }
        Relationships: []
      }
      pending_topic_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          post_content: string
          post_title: string
          requested_by: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          topic_description: string
          topic_title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          post_content: string
          post_title: string
          requested_by: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          topic_description: string
          topic_title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          post_content?: string
          post_title?: string
          requested_by?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          topic_description?: string
          topic_title?: string
          updated_at?: string
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
      promo_code_usage: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          id: string
          is_active: boolean
          max_uses: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          id?: string
          is_active?: boolean
          max_uses?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          id?: string
          is_active?: boolean
          max_uses?: number
          updated_at?: string
        }
        Relationships: []
      }
      provider_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          provider_id: string
          start_time: string
          timezone: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          provider_id: string
          start_time: string
          timezone?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          provider_id?: string
          start_time?: string
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_availability_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_availability_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers_public"
            referencedColumns: ["id"]
          },
        ]
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
      provider_date_overrides: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          is_available: boolean
          notes: string | null
          override_date: string
          provider_id: string
          start_time: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          is_available?: boolean
          notes?: string | null
          override_date: string
          provider_id: string
          start_time?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          is_available?: boolean
          notes?: string | null
          override_date?: string
          provider_id?: string
          start_time?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_date_overrides_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_date_overrides_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "consultation_providers_public"
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
      roadmap_assessments: {
        Row: {
          created_at: string | null
          current_situation: string | null
          desired_help: string | null
          duration: string | null
          id: string
          prior_treatment: string | null
          relationship: string | null
          safety_concerns: string | null
          stage_assigned: string | null
          substances: string[] | null
        }
        Insert: {
          created_at?: string | null
          current_situation?: string | null
          desired_help?: string | null
          duration?: string | null
          id?: string
          prior_treatment?: string | null
          relationship?: string | null
          safety_concerns?: string | null
          stage_assigned?: string | null
          substances?: string[] | null
        }
        Update: {
          created_at?: string | null
          current_situation?: string | null
          desired_help?: string | null
          duration?: string | null
          id?: string
          prior_treatment?: string | null
          relationship?: string | null
          safety_concerns?: string | null
          stage_assigned?: string | null
          substances?: string[] | null
        }
        Relationships: []
      }
      roadmap_users: {
        Row: {
          assessment_id: string | null
          checklist_progress: Json | null
          created_at: string | null
          current_stage: string | null
          email: string
          id: string
          last_checkin: string | null
        }
        Insert: {
          assessment_id?: string | null
          checklist_progress?: Json | null
          created_at?: string | null
          current_stage?: string | null
          email: string
          id?: string
          last_checkin?: string | null
        }
        Update: {
          assessment_id?: string | null
          checklist_progress?: Json | null
          created_at?: string | null
          current_stage?: string | null
          email?: string
          id?: string
          last_checkin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_users_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "roadmap_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      survey_questions: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_standard: boolean
          options: Json | null
          question_text: string
          question_type: string
          survey_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_standard?: boolean
          options?: Json | null
          question_text: string
          question_type?: string
          survey_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_standard?: boolean
          options?: Json | null
          question_text?: string
          question_type?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          answers: Json
          id: string
          submitted_at: string
          survey_id: string
        }
        Insert: {
          answers?: Json
          id?: string
          submitted_at?: string
          survey_id: string
        }
        Update: {
          answers?: Json
          id?: string
          submitted_at?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          city: string
          created_at: string
          experience: string
          first_name: string
          id: string
          is_approved: boolean
          last_initial: string
          rating: number
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          experience: string
          first_name: string
          id?: string
          is_approved?: boolean
          last_initial: string
          rating: number
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          experience?: string
          first_name?: string
          id?: string
          is_approved?: boolean
          last_initial?: string
          rating?: number
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_forum_badges: {
        Row: {
          awarded_at: string
          awarded_by: string | null
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          awarded_by?: string | null
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          awarded_by?: string | null
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_forum_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "forum_badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_preferences: {
        Row: {
          created_at: string
          id: string
          mention_notifications: boolean
          updated_at: string
          user_id: string
          weekly_education_nudge: boolean
          weekly_forum_digest: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          mention_notifications?: boolean
          updated_at?: string
          user_id: string
          weekly_education_nudge?: boolean
          weekly_forum_digest?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          mention_notifications?: boolean
          updated_at?: string
          user_id?: string
          weekly_education_nudge?: boolean
          weekly_forum_digest?: boolean
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
      zoom_attendance: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          join_time: string
          leave_time: string | null
          meeting_date: string
          participant_email: string | null
          participant_name: string
          referral_registration_id: string | null
          registration_id: string | null
          zoom_meeting_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          join_time: string
          leave_time?: string | null
          meeting_date: string
          participant_email?: string | null
          participant_name: string
          referral_registration_id?: string | null
          registration_id?: string | null
          zoom_meeting_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          join_time?: string
          leave_time?: string | null
          meeting_date?: string
          participant_email?: string | null
          participant_name?: string
          referral_registration_id?: string | null
          registration_id?: string | null
          zoom_meeting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zoom_attendance_referral_registration_id_fkey"
            columns: ["referral_registration_id"]
            isOneToOne: false
            referencedRelation: "zoom_meeting_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zoom_attendance_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "zoom_meeting_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      zoom_call_recordings: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean
          recording_date: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          recording_date: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          youtube_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          recording_date?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: []
      }
      zoom_link_clicks: {
        Row: {
          clicked_at: string
          id: string
          ip_address: string | null
          meeting_date: string
          registration_email: string
          registration_id: string | null
          registration_name: string
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          ip_address?: string | null
          meeting_date: string
          registration_email: string
          registration_id?: string | null
          registration_name: string
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          ip_address?: string | null
          meeting_date?: string
          registration_email?: string
          registration_id?: string | null
          registration_name?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zoom_link_clicks_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "zoom_meeting_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      zoom_meeting_registrations: {
        Row: {
          auto_register: boolean
          consent_email_list: boolean
          created_at: string
          email: string
          followup_sequence_status: string
          id: string
          last_followup_at: string | null
          lead_reasons: string[]
          lead_score: number
          lead_tier: string
          meeting_date: string
          name: string
          next_followup_at: string | null
          next_revenue_action: string
          nme_attributed: boolean
          phone: string
          preferred_contact_date: string | null
          preferred_contact_time: string | null
          preferred_timezone: string | null
          question: string
          request_follow_up: boolean
          revenue_path: string
          user_id: string | null
        }
        Insert: {
          auto_register?: boolean
          consent_email_list?: boolean
          created_at?: string
          email: string
          followup_sequence_status?: string
          id?: string
          last_followup_at?: string | null
          lead_reasons?: string[]
          lead_score?: number
          lead_tier?: string
          meeting_date?: string
          name: string
          next_followup_at?: string | null
          next_revenue_action?: string
          nme_attributed?: boolean
          phone: string
          preferred_contact_date?: string | null
          preferred_contact_time?: string | null
          preferred_timezone?: string | null
          question: string
          request_follow_up?: boolean
          revenue_path?: string
          user_id?: string | null
        }
        Update: {
          auto_register?: boolean
          consent_email_list?: boolean
          created_at?: string
          email?: string
          followup_sequence_status?: string
          id?: string
          last_followup_at?: string | null
          lead_reasons?: string[]
          lead_score?: number
          lead_tier?: string
          meeting_date?: string
          name?: string
          next_followup_at?: string | null
          next_revenue_action?: string
          nme_attributed?: boolean
          phone?: string
          preferred_contact_date?: string | null
          preferred_contact_time?: string | null
          preferred_timezone?: string | null
          question?: string
          request_follow_up?: boolean
          revenue_path?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      consultation_providers_public: {
        Row: {
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          photo_url: string | null
          session_duration_minutes: number | null
          session_rate: number | null
          specialties: string[] | null
          status: string | null
          timezone: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          photo_url?: string | null
          session_duration_minutes?: number | null
          session_rate?: number | null
          specialties?: string[] | null
          status?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          photo_url?: string | null
          session_duration_minutes?: number | null
          session_rate?: number | null
          specialties?: string[] | null
          status?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      forum_posts_secure: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          is_anonymous: boolean | null
          is_pinned: boolean | null
          needs_support: boolean | null
          parent_post_id: string | null
          title: string | null
          topic_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          is_pinned?: boolean | null
          needs_support?: boolean | null
          parent_post_id?: string | null
          title?: string | null
          topic_id?: string | null
          updated_at?: string | null
          user_id?: never
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          is_pinned?: boolean | null
          needs_support?: boolean | null
          parent_post_id?: string | null
          title?: string | null
          topic_id?: string | null
          updated_at?: string | null
          user_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_analytics: {
        Row: {
          guide_name: string | null
          guide_path: string | null
          month: string | null
          total_views: number | null
          unique_sessions: number | null
          unique_users: number | null
        }
        Relationships: []
      }
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
          address?: never
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
          address?: never
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
    }
    Functions: {
      get_booking_slots: {
        Args: never
        Returns: {
          booking_date: string
          end_time: string
          provider_id: string
          start_time: string
          timezone: string
        }[]
      }
      get_guide_analytics: {
        Args: never
        Returns: {
          guide_name: string
          guide_path: string
          month: string
          total_views: number
          unique_sessions: number
          unique_users: number
        }[]
      }
      get_my_provider_subscriptions_with_provider: {
        Args: never
        Returns: Database["public"]["CompositeTypes"]["provider_subscription_with_provider"][]
        SetofOptions: {
          from: "*"
          to: "provider_subscription_with_provider"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_promo_remaining: { Args: { promo_code: string }; Returns: number }
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
        Returns: Database["public"]["CompositeTypes"]["provider_subscription_with_provider"][]
        SetofOptions: {
          from: "*"
          to: "provider_subscription_with_provider"
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
      get_user_last_sign_in: {
        Args: { _user_ids: string[] }
        Returns: {
          created_at: string
          last_sign_in_at: string
          user_id: string
        }[]
      }
      has_active_provider_subscription: {
        Args: { _provider_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_active_family_member: { Args: { _user_id: string }; Returns: boolean }
      is_email_meeting_blocked: { Args: { _email: string }; Returns: boolean }
      is_meeting_blocked: {
        Args: { _email: string; _name: string }
        Returns: boolean
      }
      use_promo_code: { Args: { promo_code: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "user" | "moderator"
    }
    CompositeTypes: {
      provider_subscription_with_provider: {
        id: string | null
        user_id: string | null
        provider_submission_id: string | null
        paypal_subscription_id: string | null
        plan_type: string | null
        status: string | null
        amount: number | null
        start_date: string | null
        next_billing_date: string | null
        created_at: string | null
        updated_at: string | null
        provider_name: string | null
      }
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
