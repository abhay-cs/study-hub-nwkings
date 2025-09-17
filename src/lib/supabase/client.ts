import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = "https://jvacvvydudtzppdwtgef.supabase.co"
const API_ANON_SUPABASE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2YWN2dnlkdWR0enBwZHd0Z2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDQ3OTgsImV4cCI6MjA3MDg4MDc5OH0.PXiy-rJ7sD0ynlMpLiZF5T4bdPBUijNSoyMrN6P-lIM"

const supabaseKey = API_ANON_SUPABASE
export const supabase = createBrowserClient(supabaseUrl, supabaseKey)

