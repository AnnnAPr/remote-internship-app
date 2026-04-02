import { NextResponse } from "next/server";
import { RemotiveResponse } from "@/types/job";
import { mockJobs } from "@/data/mockJobs";

export async function GET() {
  try {
    // Remotive api call
    const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=10", {
      next: { revalidate: 3600 },
    });
    console.log("res", res);

    if (!res.ok) {
      throw new Error(`Remotive API responded with status: ${res.status}`);
    }

    const data: RemotiveResponse = await res.json();
    console.log("REMOTIVE DATA:", JSON.stringify(data, null, 2));

    // return mock data
    return NextResponse.json({
      jobs: mockJobs,
      realCount: data["job-count"],
      message: "Data is mocked for UI consistency, but the backend made a real Remotive API call.",
    });
  } catch (error) {
    console.error("Error fetching from Remotive API: api/jobs", error);

    // return mock data in case of error
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
