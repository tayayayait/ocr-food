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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          analysis_id: string | null
          created_at: string
          error_code: string | null
          id: string
          meal_date: string | null
          message: string
          raw_message: string | null
          stage: string
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          error_code?: string | null
          id?: string
          meal_date?: string | null
          message: string
          raw_message?: string | null
          stage: string
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          error_code?: string | null
          id?: string
          meal_date?: string | null
          message?: string
          raw_message?: string | null
          stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "meal_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      care_recommendations: {
        Row: {
          analysis_id: string
          created_at: string
          id: string
          priority: string
          reason: string
          sort_order: number
          tags: string[] | null
          title: string
        }
        Insert: {
          analysis_id: string
          created_at?: string
          id?: string
          priority?: string
          reason: string
          sort_order?: number
          tags?: string[] | null
          title: string
        }
        Update: {
          analysis_id?: string
          created_at?: string
          id?: string
          priority?: string
          reason?: string
          sort_order?: number
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_recommendations_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "meal_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_keywords: {
        Row: {
          analysis_id: string
          code: string
          created_at: string
          id: string
          label: string
          score: number
        }
        Insert: {
          analysis_id: string
          code: string
          created_at?: string
          id?: string
          label: string
          score?: number
        }
        Update: {
          analysis_id?: string
          code?: string
          created_at?: string
          id?: string
          label?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "diet_keywords_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "meal_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      keyword_rules: {
        Row: {
          created_at: string
          diet_code: string
          id: string
          is_active: boolean
          keyword: string
          recommendation_text: string
          updated_at: string
          version: number
          weight: number
        }
        Insert: {
          created_at?: string
          diet_code: string
          id?: string
          is_active?: boolean
          keyword: string
          recommendation_text: string
          updated_at?: string
          version?: number
          weight?: number
        }
        Update: {
          created_at?: string
          diet_code?: string
          id?: string
          is_active?: boolean
          keyword?: string
          recommendation_text?: string
          updated_at?: string
          version?: number
          weight?: number
        }
        Relationships: []
      }
      meal_analyses: {
        Row: {
          created_at: string
          error_code: string | null
          error_message: string | null
          id: string
          image_url: string
          meal_date: string | null
          original_filename: string | null
          progress: number
          stage: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          image_url: string
          meal_date?: string | null
          original_filename?: string | null
          progress?: number
          stage?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          image_url?: string
          meal_date?: string | null
          original_filename?: string | null
          progress?: number
          stage?: string
          updated_at?: string
        }
        Relationships: []
      }
      ocr_items: {
        Row: {
          analysis_id: string
          confidence: number
          corrected_by: string | null
          corrected_text: string | null
          created_at: string
          id: string
          sort_order: number
          text: string
        }
        Insert: {
          analysis_id: string
          confidence?: number
          corrected_by?: string | null
          corrected_text?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          text: string
        }
        Update: {
          analysis_id?: string
          confidence?: number
          corrected_by?: string | null
          corrected_text?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "ocr_items_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "meal_analyses"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
