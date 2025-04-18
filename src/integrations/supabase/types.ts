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
      outfit_logs: {
        Row: {
          activity: string | null
          ai_suggested: boolean | null
          created_at: string
          custom_activity: string | null
          date: string
          id: string
          notes: string | null
          outfit_id: string
          temperature: string | null
          time_of_day: string
          updated_at: string
          user_id: string
          weather_condition: string | null
        }
        Insert: {
          activity?: string | null
          ai_suggested?: boolean | null
          created_at?: string
          custom_activity?: string | null
          date: string
          id?: string
          notes?: string | null
          outfit_id: string
          temperature?: string | null
          time_of_day: string
          updated_at?: string
          user_id: string
          weather_condition?: string | null
        }
        Update: {
          activity?: string | null
          ai_suggested?: boolean | null
          created_at?: string
          custom_activity?: string | null
          date?: string
          id?: string
          notes?: string | null
          outfit_id?: string
          temperature?: string | null
          time_of_day?: string
          updated_at?: string
          user_id?: string
          weather_condition?: string | null
        }
        Relationships: []
      }
      outfits: {
        Row: {
          color_scheme: string | null
          colors: string[] | null
          created_at: string | null
          date_added: string | null
          favorite: boolean | null
          id: string
          items: string[]
          last_worn: string | null
          name: string
          notes: string | null
          occasion: string | null
          occasions: string[] | null
          personality_tags: string[] | null
          season: string[] | null
          tags: string[] | null
          times_worn: number | null
          user_id: string
        }
        Insert: {
          color_scheme?: string | null
          colors?: string[] | null
          created_at?: string | null
          date_added?: string | null
          favorite?: boolean | null
          id?: string
          items: string[]
          last_worn?: string | null
          name: string
          notes?: string | null
          occasion?: string | null
          occasions?: string[] | null
          personality_tags?: string[] | null
          season?: string[] | null
          tags?: string[] | null
          times_worn?: number | null
          user_id: string
        }
        Update: {
          color_scheme?: string | null
          colors?: string[] | null
          created_at?: string | null
          date_added?: string | null
          favorite?: boolean | null
          id?: string
          items?: string[]
          last_worn?: string | null
          name?: string
          notes?: string | null
          occasion?: string | null
          occasions?: string[] | null
          personality_tags?: string[] | null
          season?: string[] | null
          tags?: string[] | null
          times_worn?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          climate_preferences: string[] | null
          created_at: string | null
          favorite_colors: string[] | null
          favorite_styles: string[] | null
          id: string
          message_count: number | null
          occasions_preferences: string[] | null
          preferred_city: string | null
          preferred_country: string | null
          reminder_enabled: boolean | null
          seasonal_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          climate_preferences?: string[] | null
          created_at?: string | null
          favorite_colors?: string[] | null
          favorite_styles?: string[] | null
          id?: string
          message_count?: number | null
          occasions_preferences?: string[] | null
          preferred_city?: string | null
          preferred_country?: string | null
          reminder_enabled?: boolean | null
          seasonal_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          climate_preferences?: string[] | null
          created_at?: string | null
          favorite_colors?: string[] | null
          favorite_styles?: string[] | null
          id?: string
          message_count?: number | null
          occasions_preferences?: string[] | null
          preferred_city?: string | null
          preferred_country?: string | null
          reminder_enabled?: boolean | null
          seasonal_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_message_count: {
        Args: { user_id_param: string }
        Returns: undefined
      }
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
