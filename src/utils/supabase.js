import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
	'https://kiuugqblxerrsztkhslu.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdXVncWJseGVycnN6dGtoc2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY5Mjc1ODcsImV4cCI6MTk3MjUwMzU4N30.U1n1YHNId1aApLCXtVVCQ_3ohNTnQ891UDmdTVeVShY'
)
