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
      bills: {
        Row: {
          bill_date: string
          bill_number: string
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number
          id: string
          items: Json
          payment_method: string | null
          payment_status: string | null
          qr_code_token: string | null
          qr_expires_at: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bill_date?: string
          bill_number: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number
          id?: string
          items?: Json
          payment_method?: string | null
          payment_status?: string | null
          qr_code_token?: string | null
          qr_expires_at?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bill_date?: string
          bill_number?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number
          id?: string
          items?: Json
          payment_method?: string | null
          payment_status?: string | null
          qr_code_token?: string | null
          qr_expires_at?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      category_sales: {
        Row: {
          category: string
          created_at: string
          date: string
          id: string
          total_profit: number
          total_quantity: number
          total_sales: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          id?: string
          total_profit?: number
          total_quantity?: number
          total_sales?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          id?: string
          total_profit?: number
          total_quantity?: number
          total_sales?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          product_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          template_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          template_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          template_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_name: string
          created_at: string
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          items: Json
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_date: string
          invoice_number: string
          items?: Json
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          items?: Json
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      monthly_sales_summary: {
        Row: {
          created_at: string
          id: string
          month: number
          total_bills: number
          total_invoices: number
          total_profit: number
          total_sales: number
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          total_bills?: number
          total_invoices?: number
          total_profit?: number
          total_sales?: number
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          total_bills?: number
          total_invoices?: number
          total_profit?: number
          total_sales?: number
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      product_sales: {
        Row: {
          created_at: string
          date: string
          id: string
          product_id: string
          quantity_sold: number
          total_profit: number
          total_sales: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          product_id: string
          quantity_sold?: number
          total_profit?: number
          total_sales?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          product_id?: string
          quantity_sold?: number
          total_profit?: number
          total_sales?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand: string | null
          category: string | null
          cost_price: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          min_stock_level: number | null
          name: string
          price: number
          quantity_in_stock: number
          sku: string | null
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          min_stock_level?: number | null
          name: string
          price?: number
          quantity_in_stock?: number
          sku?: string | null
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          min_stock_level?: number | null
          name?: string
          price?: number
          quantity_in_stock?: number
          sku?: string | null
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_address: string | null
          business_gstin: string | null
          business_name: string | null
          business_phone: string | null
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          business_address?: string | null
          business_gstin?: string | null
          business_name?: string | null
          business_phone?: string | null
          created_at?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          business_address?: string | null
          business_gstin?: string | null
          business_name?: string | null
          business_phone?: string | null
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotations: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_name: string
          created_at: string
          id: string
          items: Json
          quote_date: string
          quote_number: string
          status: string
          subtotal: number
          tax_amount: number
          terms: string | null
          total_amount: number
          updated_at: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          id?: string
          items?: Json
          quote_date: string
          quote_number: string
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          id?: string
          items?: Json
          quote_date?: string
          quote_number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      shared_invoices: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          invoice_id: string
          is_active: boolean
          share_token: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          invoice_id: string
          is_active?: boolean
          share_token: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          invoice_id?: string
          is_active?: boolean
          share_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_invoices_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_sales_summary: {
        Row: {
          created_at: string
          id: string
          total_bills: number
          total_invoices: number
          total_profit: number
          total_sales: number
          updated_at: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_bills?: number
          total_invoices?: number
          total_profit?: number
          total_sales?: number
          updated_at?: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          id?: string
          total_bills?: number
          total_invoices?: number
          total_profit?: number
          total_sales?: number
          updated_at?: string
          user_id?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_barcode: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_bill_number: {
        Args: { user_uuid: string }
        Returns: string
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
