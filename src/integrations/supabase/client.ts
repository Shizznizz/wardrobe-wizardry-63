
import { createClient } from '@supabase/supabase-js';

// Use direct values for the Supabase URL and anon key
const supabaseUrl = 'https://aaiyxtbovepseasghtth.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaXl4dGJvdmVwc2Vhc2dodHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzcxNDMsImV4cCI6MjA1ODA1MzE0M30.Pq66ZdBT_ZEBnPbXkDe-SVMnMvqoNjcuTo05GcPabL0';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
