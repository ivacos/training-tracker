import { createClient } from '@supabase/supabase-js';

// 1. Accedemos a las variables de entorno de tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 2. Verificación de seguridad (Fail Fast)
// Si por lo que sea no lee las claves, la app explota aquí y te avisa,
// en vez de fallar silenciosamente más adelante.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Faltan las variables de entorno de Supabase. Revisa tu .env.local');
}

// 3. Exportamos la instancia única (Singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);