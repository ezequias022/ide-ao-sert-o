import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://wzhrxehtabfxuwlhqpis.supabase.co'
const SUPABASE_KEY = 'sb_publishable_3PnfC4abUtL5LFGnOY8log_TgEZCKN3'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)