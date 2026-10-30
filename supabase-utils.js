import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// change these to your own url and key
// find these in your project dashboard
const supabaseUrl = 'https://xxvvxdmzpdtoytyrnpzm.supabase.co'
const supabaseKey = 'sb_publishable_WtVC7sRQL1PXgGEvkEvUhw_aQcZsVOq'
export const supabase = createClient(supabaseUrl, supabaseKey)
export const user = await supabase.auth.getUser()
