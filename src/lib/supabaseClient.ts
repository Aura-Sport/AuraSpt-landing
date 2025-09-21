import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Mensaje claro en consola para depurar configuración de entorno
  // eslint-disable-next-line no-console
  console.error('[Config Supabase] Variables faltantes:', {
    VITE_SUPABASE_URL: !!supabaseUrl,
    VITE_SUPABASE_ANON_KEY: !!supabaseAnonKey,
  });
  // eslint-disable-next-line no-console
  console.error('[Config Supabase] Asegúrate de definir VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env(.local) en la raíz y reiniciar "npm run dev"');
  throw new Error('Config: Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


