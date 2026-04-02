import { createClient } from '@/utils/supabase/server';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const supabase = await createClient();
	const { job } = await req.json();

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) {
		return NextResponse.json({ error: "You must be logged in to save jobs." }, { status: 401 });
	}

	const { error } = await supabase.from('saved_jobs').upsert({
		user_id: user.id,
		job_id: job.id,
		job_data: job
	}, { onConflict: 'user_id, job_id' });

	if (error) {
		return NextResponse.json({ error: "Failed to save" }, { status: 500 });
	}

	return NextResponse.json({ saved: true });

}