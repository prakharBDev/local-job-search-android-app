import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqb29ibG1qcHhqaGV0bHVja294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTQ5NjEsImV4cCI6MjA2NjE3MDk2MX0.y4-4RtuqvjzEp0GXIh0z8TSoc5BIIRsPx_4AgS-ozOs';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqb29ibG1qcHhqaGV0bHVja294Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU5NDk2MSwiZXhwIjoyMDY2MTcwOTYxfQ.xqr3ZNI_EW-Ym86c5QZZwq0dTID6cpnuZh9UJd9dA6s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const users = await supabase.from('users');