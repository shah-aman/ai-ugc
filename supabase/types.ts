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
      avatars: {
        Row: {
          avatar_id: string
          created_at: string
          description: string | null
          gender: string | null
          image_url: string | null
          name: string | null
        }
        Insert: {
          avatar_id: string
          created_at?: string
          description?: string | null
          gender?: string | null
          image_url?: string | null
          name?: string | null
        }
        Update: {
          avatar_id?: string
          created_at?: string
          description?: string | null
          gender?: string | null
          image_url?: string | null
          name?: string | null
        }
        Relationships: []
      }
      b_roll: {
        Row: {
          created_at: string
          description: string | null
          id: string
          product_link: string
          updated_at: string
          video_link: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          product_link: string
          updated_at?: string
          video_link?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          product_link?: string
          updated_at?: string
          video_link?: string | null
        }
        Relationships: []
      }
      influencers: {
        Row: {
          avatar_id: string | null
          created_at: string
          id: string
          image_url: string | null
          influencer_research: Json | null
          name: string
          tiktok_profile_link: string | null
          updated_at: string
          voice_id: string | null
        }
        Insert: {
          avatar_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          influencer_research?: Json | null
          name: string
          tiktok_profile_link?: string | null
          updated_at?: string
          voice_id?: string | null
        }
        Update: {
          avatar_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          influencer_research?: Json | null
          name?: string
          tiktok_profile_link?: string | null
          updated_at?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      new_scripts: {
        Row: {
          b_roll_used: string[] | null
          created_at: string
          full_script: string | null
          id: string
          influencer_id: string | null
          product_link: string | null
          raw_video_link: string | null
          script: Json[] | null
        }
        Insert: {
          b_roll_used?: string[] | null
          created_at?: string
          full_script?: string | null
          id?: string
          influencer_id?: string | null
          product_link?: string | null
          raw_video_link?: string | null
          script?: Json[] | null
        }
        Update: {
          b_roll_used?: string[] | null
          created_at?: string
          full_script?: string | null
          id?: string
          influencer_id?: string | null
          product_link?: string | null
          raw_video_link?: string | null
          script?: Json[] | null
        }
        Relationships: []
      }
      research: {
        Row: {
          created_at: string
          customer_intent: Json | null
          customer_profile: Json | null
          id: string
          product_image_url: string | null
          product_info: Json | null
          product_link: string
          product_research: Json | null
          selected_influencer: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_intent?: Json | null
          customer_profile?: Json | null
          id?: string
          product_image_url?: string | null
          product_info?: Json | null
          product_link: string
          product_research?: Json | null
          selected_influencer?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_intent?: Json | null
          customer_profile?: Json | null
          id?: string
          product_image_url?: string | null
          product_info?: Json | null
          product_link?: string
          product_research?: Json | null
          selected_influencer?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_selected_influencer_fkey"
            columns: ["selected_influencer"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      scripts: {
        Row: {
          b_roll_used: string[] | null
          cartesia_voice_id: string | null
          created_at: string
          full_script: string | null
          id: string
          influencer_id: string
          processed_video_link: string | null
          product_link: string
          raw_video_link: string | null
          script_reasoning: string | null
          structured_script: Json[] | null
          updated_at: string
        }
        Insert: {
          b_roll_used?: string[] | null
          cartesia_voice_id?: string | null
          created_at?: string
          full_script?: string | null
          id?: string
          influencer_id: string
          processed_video_link?: string | null
          product_link: string
          raw_video_link?: string | null
          script_reasoning?: string | null
          structured_script?: Json[] | null
          updated_at?: string
        }
        Update: {
          b_roll_used?: string[] | null
          cartesia_voice_id?: string | null
          created_at?: string
          full_script?: string | null
          id?: string
          influencer_id?: string
          processed_video_link?: string | null
          product_link?: string
          raw_video_link?: string | null
          script_reasoning?: string | null
          structured_script?: Json[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
