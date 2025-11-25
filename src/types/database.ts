export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          brand: string | null
          designer: string | null
          price: number
          category: string | null
          collection: string | null
          finish: string | null
          tags: string[]
          featured: boolean
          featured_rank: number | null
          in_stock: boolean
          inventory_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand?: string | null
          designer?: string | null
          price: number
          category?: string | null
          collection?: string | null
          finish?: string | null
          tags?: string[]
          featured?: boolean
          featured_rank?: number | null
          in_stock?: boolean
          inventory_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string | null
          designer?: string | null
          price?: number
          category?: string | null
          collection?: string | null
          finish?: string | null
          tags?: string[]
          featured?: boolean
          featured_rank?: number | null
          in_stock?: boolean
          inventory_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          cloudinary_public_id: string
          alt_text: string | null
          display_order: number
          widths: number[]
          sizes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          cloudinary_public_id: string
          alt_text?: string | null
          display_order?: number
          widths?: number[]
          sizes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          cloudinary_public_id?: string
          alt_text?: string | null
          display_order?: number
          widths?: number[]
          sizes?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_email: string
          customer_name: string
          status: string
          subtotal: number
          tax: number
          shipping: number
          total: number
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_email: string
          customer_name: string
          status?: string
          subtotal: number
          tax: number
          shipping: number
          total: number
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_email?: string
          customer_name?: string
          status?: string
          subtotal?: number
          tax?: number
          shipping?: number
          total?: number
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_purchase?: number
          created_at?: string
        }
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
  }
}
