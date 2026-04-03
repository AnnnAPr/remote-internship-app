import { NextResponse } from "next/server";
import { RemotiveResponse } from "@/types/job";
import { mockJobs } from "@/data/mockJobs";

export async function GET() {
  try {
    const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=10", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Remotive API responded with status: ${res.status}`);
    }

    const data: RemotiveResponse = await res.json();

    // Print real remotive job for demo
    console.log("--- ONE SAMPLE JOB ---");
    if (data.jobs && data.jobs.length > 0) {
      const { description, ...jobWithoutDescription } = data.jobs[0];

      console.log(JSON.stringify(jobWithoutDescription, null, 2));
    }
    console.log("--- END SAMPLE JOB ---");

    return NextResponse.json({
      jobs: mockJobs,
      realCount: data["job-count"],
      message: "Data is mocked for UI consistency, but the backend made a real Remotive API call.",
    });
  } catch (error) {
    console.error("Error fetching from Remotive API: api/jobs", error);

    return NextResponse.json(
      {
        jobs: mockJobs,
        realCount: 0,
        message: "Data is mocked. Remotive API call failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
