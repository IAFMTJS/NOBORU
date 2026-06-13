/**
 * Supabase database types.
 * Regenerate after schema changes: npm run db:types
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      review_items: {
        Row: {
          id: string;
          user_id: string;
          content_type: string;
          content_id: string;
          state: string;
          next_review_at: string;
          review_count: number;
          mastery_score: number;
          interval_days: number;
          streak_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["review_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["review_items"]["Row"]>;
        Relationships: [];
      };
      review_history: {
        Row: {
          id: string;
          user_id: string;
          review_item_id: string;
          rating: string;
          previous_state: string;
          new_state: string;
          mastery_score: number;
          interval_days: number;
          client_event_id: string | null;
          gamification_applied_at: string | null;
          gamification_result: Json | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["review_history"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["review_history"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_review_stats: {
        Args: { p_user_id: string };
        Returns: Json;
      };
      get_learned_content_count: {
        Args: { p_user_id: string; p_content_type: string };
        Returns: number;
      };
      submit_review_rating: {
        Args: {
          p_user_id: string;
          p_review_item_id: string;
          p_rating: string;
          p_client_event_id?: string | null;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ReviewItemDbRow =
  Database["public"]["Tables"]["review_items"]["Row"];

export type SubmitReviewRatingRpcResult = {
  already_applied: boolean;
  history_id: string | null;
  item: ReviewItemDbRow;
};
