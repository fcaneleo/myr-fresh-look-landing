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
          Ajuste: number | null
          Cantidad_Mayor: number | null
          Categoria: number
          Codigo: number
          Codigo_Proveedor: number | null
          Codigo_Proveedor2: string | null
          Codigo_Proveedor3: string | null
          Codigo_Texto: string
          Con_Impuesto: boolean | null
          Costo: number
          Costo_Neto: number | null
          created_at: string | null
          Descripcion: string
          descripcion_larga: string | null
          featured: boolean | null
          id: number
          image_url: string | null
          oferta: boolean | null
          Precio: number
          Precio_Mayor: number | null
          Promocion: boolean | null
          Servicio: boolean | null
          Stock: number
          Stock_Minimo: number | null
          Tipo_Impuesto: number | null
          Unidad_Medida: number
          updated_at: string | null
          Valor_Impuesto: number | null
          vigencia: boolean | null
        }
        Insert: {
          Ajuste?: number | null
          Cantidad_Mayor?: number | null
          Categoria: number
          Codigo: number
          Codigo_Proveedor?: number | null
          Codigo_Proveedor2?: string | null
          Codigo_Proveedor3?: string | null
          Codigo_Texto: string
          Con_Impuesto?: boolean | null
          Costo: number
          Costo_Neto?: number | null
          created_at?: string | null
          Descripcion: string
          descripcion_larga?: string | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          oferta?: boolean | null
          Precio: number
          Precio_Mayor?: number | null
          Promocion?: boolean | null
          Servicio?: boolean | null
          Stock: number
          Stock_Minimo?: number | null
          Tipo_Impuesto?: number | null
          Unidad_Medida: number
          updated_at?: string | null
          Valor_Impuesto?: number | null
          vigencia?: boolean | null
        }
        Update: {
          Ajuste?: number | null
          Cantidad_Mayor?: number | null
          Categoria?: number
          Codigo?: number
          Codigo_Proveedor?: number | null
          Codigo_Proveedor2?: string | null
          Codigo_Proveedor3?: string | null
          Codigo_Texto?: string
          Con_Impuesto?: boolean | null
          Costo?: number
          Costo_Neto?: number | null
          created_at?: string | null
          Descripcion?: string
          descripcion_larga?: string | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          oferta?: boolean | null
          Precio?: number
          Precio_Mayor?: number | null
          Promocion?: boolean | null
          Servicio?: boolean | null
          Stock?: number
          Stock_Minimo?: number | null
          Tipo_Impuesto?: number | null
          Unidad_Medida?: number
          updated_at?: string | null
          Valor_Impuesto?: number | null
          vigencia?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_familia_id_fkey"
            columns: ["Categoria"]
            isOneToOne: false
            referencedRelation: "familias"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vista_productos_completa: {
        Row: {
          Ajuste: number | null
          Cantidad_Mayor: number | null
          Categoria: number | null
          categoria_nombre: string | null
          Codigo: number | null
          Codigo_Proveedor: number | null
          Codigo_Proveedor2: string | null
          Codigo_Proveedor3: string | null
          Codigo_Texto: string | null
          Con_Impuesto: boolean | null
          Costo: number | null
          Costo_Neto: number | null
          created_at: string | null
          Descripcion: string | null
          descripcion_larga: string | null
          featured: boolean | null
          id: number | null
          image_url: string | null
          oferta: boolean | null
          Precio: number | null
          Precio_Mayor: number | null
          Promocion: boolean | null
          Servicio: boolean | null
          Stock: number | null
          Stock_Minimo: number | null
          Tipo_Impuesto: number | null
          Unidad_Medida: number | null
          updated_at: string | null
          Valor_Impuesto: number | null
          vigencia: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_familia_id_fkey"
            columns: ["Categoria"]
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
