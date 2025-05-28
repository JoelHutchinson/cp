export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
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
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          username: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          username?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          username?: string;
        };
        Relationships: [];
      };
      puzzle_set_puzzles: {
        Row: {
          id: string;
          index: number;
          progress: Json;
          puzzle_id: string;
          puzzle_set_id: string;
        };
        Insert: {
          id?: string;
          index?: number;
          progress?: Json;
          puzzle_id?: string;
          puzzle_set_id?: string;
        };
        Update: {
          id?: string;
          index?: number;
          progress?: Json;
          puzzle_id?: string;
          puzzle_set_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "puzzle_set_puzzles_puzzle_id_fkey";
            columns: ["puzzle_id"];
            isOneToOne: false;
            referencedRelation: "puzzles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "puzzle_set_puzzles_puzzle_set_id_fkey";
            columns: ["puzzle_set_id"];
            isOneToOne: false;
            referencedRelation: "puzzle_sets";
            referencedColumns: ["id"];
          }
        ];
      };
      puzzle_sets: {
        Row: {
          created_at: string;
          current_cycle: number;
          id: string;
          is_default: boolean;
          name: string;
          profile_id: string;
          slug: string;
          total_cycles: number;
        };
        Insert: {
          created_at?: string;
          current_cycle?: number;
          id?: string;
          is_default?: boolean;
          name: string;
          profile_id: string;
          slug?: string;
          total_cycles?: number;
        };
        Update: {
          created_at?: string;
          current_cycle?: number;
          id?: string;
          is_default?: boolean;
          name?: string;
          profile_id?: string;
          slug?: string;
          total_cycles?: number;
        };
        Relationships: [
          {
            foreignKeyName: "puzzle_sets_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      puzzles: {
        Row: {
          fen: string;
          game_url: string;
          id: string;
          moves: string;
          nb_plays: number;
          opening_tags: string | null;
          popularity: number;
          puzzle_id: string;
          rating: number;
          rating_deviation: number;
          themes: string;
        };
        Insert: {
          fen: string;
          game_url: string;
          id?: string;
          moves: string;
          nb_plays: number;
          opening_tags?: string | null;
          popularity: number;
          puzzle_id: string;
          rating: number;
          rating_deviation: number;
          themes: string;
        };
        Update: {
          fen?: string;
          game_url?: string;
          id?: string;
          moves?: string;
          nb_plays?: number;
          opening_tags?: string | null;
          popularity?: number;
          puzzle_id?: string;
          rating?: number;
          rating_deviation?: number;
          themes?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_puzzle_in_set: {
        Args: { _profile_id: string; _puzzle_set_slug: string };
        Returns: {
          progress: Json;
          id: string;
          fen: string;
          moves: string;
          rating: number;
          themes: string;
          opening_tags: string;
          puzzle_id: string;
          rating_deviation: number;
          popularity: number;
          game_url: string;
          nb_plays: number;
        }[];
      };
      increment_puzzle_set_cycle_if_ready: {
        Args: { _profile_id: string; _puzzle_set_slug: string };
        Returns: boolean;
      };
      update_current_puzzle_in_set_progress: {
        Args: {
          _profile_id: string;
          _puzzle_set_slug: string;
          _solved: boolean;
        };
        Returns: {
          progress: Json;
          id: string;
          fen: string;
          moves: string;
          rating: number;
          themes: string;
          opening_tags: string;
          puzzle_id: string;
          rating_deviation: number;
          popularity: number;
          game_url: string;
          nb_plays: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
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
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
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
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
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
    Enums: {},
  },
} as const;
