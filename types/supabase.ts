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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          last_login: string
          subscription_type: 'free' | 'premium'
          metadata: Json
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          last_login?: string
          subscription_type?: 'free' | 'premium'
          metadata?: Json
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          last_login?: string
          subscription_type?: 'free' | 'premium'
          metadata?: Json
        }
      }
    }
  }
}