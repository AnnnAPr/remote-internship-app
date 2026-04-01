import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// POST request to get summary from Groq API
export async function POST(req: Request) {
	try {
		const { job } = await req.json();
		if (!job || !job.title || !job.description) {
			return NextResponse.json(
				{ error: "Missing required job data (title and description)" },
				{ status: 400 }
			);
		}

		const apiKey = process.env.GROQ_API_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{ error: "API key needed. Please add it." },
				{ status: 500 }
			);
		}

		const groq = new Groq({ apiKey });

		const prompt =
			`
				Summarize the following internship position in 3 concise, punchy bullet points suitable for a student job seeker.
				Do not include intro/outro text. Just the three bullet points, each starting with a default dot character.
				
				Job Title: ${job.title}
				Company: ${job.company}
				Description: ${job.description}
      `;

		const chatCompletion = await groq.chat.completions.create({
			messages: [{ role: "user", content: prompt }],
			model: "llama-3.1-8b-instant",
		});

		const summary = chatCompletion.choices[0]?.message?.content || "No summary available";
		return NextResponse.json({ summary: summary.trim() });

	} catch (error) {
		console.error("Error generating summary:", error);
		return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
	}
}