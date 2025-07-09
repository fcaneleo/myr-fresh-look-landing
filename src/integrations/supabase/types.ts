export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      familias: {
        Row: {
          codigo: number
          created_at: string | null
          descripcion: string
          id: number
          nombre: string | null
          updated_at: string | null
        }
        Insert: {
          codigo: number
          created_at?: string | null
          descripcion: string
          id?: number
          nombre?: string | null
          updated_at?: string | null
        }
        Update: {
          codigo?: number
          created_at?: string | null
          descripcion?: string
          id?: number
          nombre?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      productos: {
        Row: {
          ajuste: number | null
          cantidad_mayor: number | null
          codigo: number
          codigo_proveedor: number | null
          codigo_proveedor2: string | null
          codigo_proveedor3: string | null
          codigo_texto: string
          con_impuesto: boolean | null
          costo: number
          costo_neto: number | null
          created_at: string | null
          descripcion: string
          descripcion_larga: string | null
          familia_id: number
          featured: boolean | null
          id: number
          image_url: string | null
          oferta: boolean | null
          precio: number
          precio_mayor: number | null
          promocion: boolean | null
          servicio: boolean | null
          stock: number
          stock_minimo: number | null
          tipo_impuesto: number | null
          unidad_medida: number
          updated_at: string | null
          valor_impuesto: number | null
          vigencia: boolean | null
        }
        Insert: {
          ajuste?: number | null
          cantidad_mayor?: number | null
          codigo: number
          codigo_proveedor?: number | null
          codigo_proveedor2?: string | null
          codigo_proveedor3?: string | null
          codigo_texto: string
          con_impuesto?: boolean | null
          costo: number
          costo_neto?: number | null
          created_at?: string | null
          descripcion: string
          descripcion_larga?: string | null
          familia_id: number
          featured?: boolean | null
          id?: number
          image_url?: string | null
          oferta?: boolean | null
          precio: number
          precio_mayor?: number | null
          promocion?: boolean | null
          servicio?: boolean | null
          stock: number
          stock_minimo?: number | null
          tipo_impuesto?: number | null
          unidad_medida: number
          updated_at?: string | null
          valor_impuesto?: number | null
          vigencia?: boolean | null
        }
        Update: {
          ajuste?: number | null
          cantidad_mayor?: number | null
          codigo?: number
          codigo_proveedor?: number | null
          codigo_proveedor2?: string | null
          codigo_proveedor3?: string | null
          codigo_texto?: string
          con_impuesto?: boolean | null
          costo?: number
          costo_neto?: number | null
          created_at?: string | null
          descripcion?: string
          descripcion_larga?: string | null
          familia_id?: number
          featured?: boolean | null
          id?: number
          image_url?: string | null
          oferta?: boolean | null
          precio?: number
          precio_mayor?: number | null
          promocion?: boolean | null
          servicio?: boolean | null
          stock?: number
          stock_minimo?: number | null
          tipo_impuesto?: number | null
          unidad_medida?: number
          updated_at?: string | null
          valor_impuesto?: number | null
          vigencia?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_familia_id_fkey"
            columns: ["familia_id"]
            isOneToOne: false
            referencedRelation: "familias"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: number
          image_url: string | null
          name: string
          oferta: boolean | null
          price: number
          updated_at: string | null
          vigencia: boolean | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          name: string
          oferta?: boolean | null
          price: number
          updated_at?: string | null
          vigencia?: boolean | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          name?: string
          oferta?: boolean | null
          price?: number
          updated_at?: string | null
          vigencia?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      vista_productos_completa: {
        Row: {
          ajuste: number | null
          cantidad_mayor: number | null
          categoria_nombre: string | null
          codigo: number | null
          codigo_proveedor: number | null
          codigo_proveedor2: string | null
          codigo_proveedor3: string | null
          codigo_texto: string | null
          con_impuesto: boolean | null
          costo: number | null
          costo_neto: number | null
          created_at: string | null
          descripcion: string | null
          familia_id: number | null
          id: number | null
          precio: number | null
          precio_mayor: number | null
          promocion: boolean | null
          servicio: boolean | null
          stock: number | null
          stock_minimo: number | null
          tipo_impuesto: number | null
          unidad_medida: number | null
          updated_at: string | null
          valor_impuesto: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_familia_id_fkey"
            columns: ["familia_id"]
            isOneToOne: false
            referencedRelation: "familias"
            referencedColumns: ["id"]
          },
        ]
      }
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
