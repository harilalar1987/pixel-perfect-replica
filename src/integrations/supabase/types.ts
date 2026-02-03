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
      bank_statements: {
        Row: {
          account_mask: string | null
          account_number: string | null
          closing_balance: number | null
          currency: string | null
          document_id: string | null
          id: string
          inserted_at: string | null
          loan_id: string | null
          meta: Json | null
          opening_balance: number | null
          statement_from: string | null
          statement_to: string | null
        }
        Insert: {
          account_mask?: string | null
          account_number?: string | null
          closing_balance?: number | null
          currency?: string | null
          document_id?: string | null
          id?: string
          inserted_at?: string | null
          loan_id?: string | null
          meta?: Json | null
          opening_balance?: number | null
          statement_from?: string | null
          statement_to?: string | null
        }
        Update: {
          account_mask?: string | null
          account_number?: string | null
          closing_balance?: number | null
          currency?: string | null
          document_id?: string | null
          id?: string
          inserted_at?: string | null
          loan_id?: string | null
          meta?: Json | null
          opening_balance?: number | null
          statement_from?: string | null
          statement_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_statements_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_statements_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          amount: number
          bank_statement_id: string | null
          counterparty: string | null
          direction: string
          id: string
          inserted_at: string | null
          narration: string | null
          occurred_at: string
          raw: Json | null
        }
        Insert: {
          amount: number
          bank_statement_id?: string | null
          counterparty?: string | null
          direction: string
          id?: string
          inserted_at?: string | null
          narration?: string | null
          occurred_at: string
          raw?: Json | null
        }
        Update: {
          amount?: number
          bank_statement_id?: string | null
          counterparty?: string | null
          direction?: string
          id?: string
          inserted_at?: string | null
          narration?: string | null
          occurred_at?: string
          raw?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_statement_id_fkey"
            columns: ["bank_statement_id"]
            isOneToOne: false
            referencedRelation: "bank_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      bureau_records: {
        Row: {
          document_id: string | null
          id: string
          inserted_at: string | null
          loan_id: string | null
          raw: Json | null
          subject_identifier: string | null
          subject_type: string | null
        }
        Insert: {
          document_id?: string | null
          id?: string
          inserted_at?: string | null
          loan_id?: string | null
          raw?: Json | null
          subject_identifier?: string | null
          subject_type?: string | null
        }
        Update: {
          document_id?: string | null
          id?: string
          inserted_at?: string | null
          loan_id?: string | null
          raw?: Json | null
          subject_identifier?: string | null
          subject_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bureau_records_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bureau_records_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          inserted_at: string | null
          loan_id: string | null
          meta: Json | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          inserted_at?: string | null
          loan_id?: string | null
          meta?: Json | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          inserted_at?: string | null
          loan_id?: string | null
          meta?: Json | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_entities: {
        Row: {
          document_id: string | null
          gstin: string | null
          id: string
          inserted_at: string | null
          legal_name: string | null
          loan_id: string | null
          meta: Json | null
          period_from: string | null
          period_to: string | null
        }
        Insert: {
          document_id?: string | null
          gstin?: string | null
          id?: string
          inserted_at?: string | null
          legal_name?: string | null
          loan_id?: string | null
          meta?: Json | null
          period_from?: string | null
          period_to?: string | null
        }
        Update: {
          document_id?: string | null
          gstin?: string | null
          id?: string
          inserted_at?: string | null
          legal_name?: string | null
          loan_id?: string | null
          meta?: Json | null
          period_from?: string | null
          period_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gst_entities_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gst_entities_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      gst_returns: {
        Row: {
          filing_status: string | null
          gst_entity_id: string | null
          gstr3b_itc: number | null
          gstr3b_revenue: number | null
          id: string
          inserted_at: string | null
          period: string | null
          raw: Json | null
        }
        Insert: {
          filing_status?: string | null
          gst_entity_id?: string | null
          gstr3b_itc?: number | null
          gstr3b_revenue?: number | null
          id?: string
          inserted_at?: string | null
          period?: string | null
          raw?: Json | null
        }
        Update: {
          filing_status?: string | null
          gst_entity_id?: string | null
          gstr3b_itc?: number | null
          gstr3b_revenue?: number | null
          id?: string
          inserted_at?: string | null
          period?: string | null
          raw?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "gst_returns_gst_entity_id_fkey"
            columns: ["gst_entity_id"]
            isOneToOne: false
            referencedRelation: "gst_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      ingestion_jobs: {
        Row: {
          document_id: string | null
          error: string | null
          finished_at: string | null
          id: string
          inserted_at: string | null
          meta: Json | null
          progress: number | null
          provider: string
          started_at: string | null
          status: string
        }
        Insert: {
          document_id?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          inserted_at?: string | null
          meta?: Json | null
          progress?: number | null
          provider: string
          started_at?: string | null
          status?: string
        }
        Update: {
          document_id?: string | null
          error?: string | null
          finished_at?: string | null
          id?: string
          inserted_at?: string | null
          meta?: Json | null
          progress?: number | null
          provider?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingestion_jobs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_decisions: {
        Row: {
          comments: string | null
          decided_at: string
          decided_by: string
          decision: string
          id: string
          loan_id: string
        }
        Insert: {
          comments?: string | null
          decided_at?: string
          decided_by: string
          decision: string
          id?: string
          loan_id: string
        }
        Update: {
          comments?: string | null
          decided_at?: string
          decided_by?: string
          decision?: string
          id?: string
          loan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_decisions_decided_by_fkey"
            columns: ["decided_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_decisions_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          anchor_name: string | null
          application_id: string
          assigned_analyst_id: string | null
          created_at: string
          customer_name: string
          id: string
          loan_amount: number
          loan_type: Database["public"]["Enums"]["loan_type"]
          status: Database["public"]["Enums"]["loan_status"]
          team: string | null
          updated_at: string
        }
        Insert: {
          anchor_name?: string | null
          application_id: string
          assigned_analyst_id?: string | null
          created_at?: string
          customer_name: string
          id?: string
          loan_amount: number
          loan_type?: Database["public"]["Enums"]["loan_type"]
          status?: Database["public"]["Enums"]["loan_status"]
          team?: string | null
          updated_at?: string
        }
        Update: {
          anchor_name?: string | null
          application_id?: string
          assigned_analyst_id?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          loan_amount?: number
          loan_type?: Database["public"]["Enums"]["loan_type"]
          status?: Database["public"]["Enums"]["loan_status"]
          team?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_assigned_analyst_id_fkey"
            columns: ["assigned_analyst_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          designation: string | null
          full_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          designation?: string | null
          full_name: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          designation?: string | null
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_loan_decision_and_update_status: {
        Args: {
          p_comments: string
          p_decided_by: string
          p_decision: string
          p_loan_id: string
        }
        Returns: {
          decision: Database["public"]["Tables"]["loan_decisions"]["Row"]
          loan: Database["public"]["Tables"]["loans"]["Row"]
        }[]
      }
      rpc_create_document_and_enqueue_ingestion: {
        Args: {
          p_file_name: string
          p_file_size: number
          p_file_type: string
          p_loan_id: string
          p_provider: string
          p_storage_path: string
        }
        Returns: {
          document_id: string
          job_id: string
        }[]
      }
    }
    Enums: {
      loan_status:
        | "under-review"
        | "approved"
        | "rejected"
        | "processing"
        | "disbursed"
      loan_type: "WCBL" | "Term Loan" | "LAP" | "OD" | "CC"
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
      loan_status: [
        "under-review",
        "approved",
        "rejected",
        "processing",
        "disbursed",
      ],
      loan_type: ["WCBL", "Term Loan", "LAP", "OD", "CC"],
    },
  },
} as const
