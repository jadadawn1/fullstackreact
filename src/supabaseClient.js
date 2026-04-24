import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkthyomiecgwjfuqiilo.supabase.co';
const supabaseKey = 'sb_publishable_kiVCRBAd65TKhr0dnx6ubg_cPyYc6DX';
export const supabase = createClient(supabaseUrl, supabaseKey);
