export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      ai_generation_stats: {
        Row: {
          ai_model_name: string;
          cards_accepted: number;
          cards_generated: number;
          cards_rejected: number;
          deck_id: string;
          generation_timestamp: string;
          id: string;
          session_id: string;
          text_length: number;
          user_id: string;
        };
        Insert: {
          ai_model_name: string;
          cards_accepted: number;
          cards_generated: number;
          cards_rejected: number;
          deck_id: string;
          generation_timestamp?: string;
          id?: string;
          session_id: string;
          text_length: number;
          user_id: string;
        };
        Update: {
          ai_model_name?: string;
          cards_accepted?: number;
          cards_generated?: number;
          cards_rejected?: number;
          deck_id?: string;
          generation_timestamp?: string;
          id?: string;
          session_id?: string;
          text_length?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_deck";
            columns: ["deck_id"];
            isOneToOne: false;
            referencedRelation: "decks";
            referencedColumns: ["id"];
          },
        ];
      };
      decks: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      error_logs: {
        Row: {
          created_at: string;
          error_context: Json | null;
          error_level: string;
          error_message: string;
          error_stack: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          error_context?: Json | null;
          error_level: string;
          error_message: string;
          error_stack?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          error_context?: Json | null;
          error_level?: string;
          error_message?: string;
          error_stack?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      flashcards: {
        Row: {
          ai_model_name: string | null;
          answer: string;
          created_at: string;
          deck_id: string;
          id: string;
          interval: number | null;
          last_ease_factor: number | null;
          next_review_date: string | null;
          origin: Database["public"]["Enums"]["flashcard_origin"];
          question: string;
          updated_at: string;
        };
        Insert: {
          ai_model_name?: string | null;
          answer: string;
          created_at?: string;
          deck_id: string;
          id?: string;
          interval?: number | null;
          last_ease_factor?: number | null;
          next_review_date?: string | null;
          origin: Database["public"]["Enums"]["flashcard_origin"];
          question: string;
          updated_at?: string;
        };
        Update: {
          ai_model_name?: string | null;
          answer?: string;
          created_at?: string;
          deck_id?: string;
          id?: string;
          interval?: number | null;
          last_ease_factor?: number | null;
          next_review_date?: string | null;
          origin?: Database["public"]["Enums"]["flashcard_origin"];
          question?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_deck";
            columns: ["deck_id"];
            isOneToOne: false;
            referencedRelation: "decks";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      flashcard_origin: "user" | "ai";
    };
    CompositeTypes: Record<never, never>;
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      flashcard_origin: ["user", "ai"],
    },
  },
} as const;
