export type JobCategory = "frontend" | "backend" | "fullstack" | "ai" | "other";
export type FilterCategory = JobCategory | "all";

export interface RemotiveJob {
	id: number;
	url: string;
	title: string;
	company_name: string;
	company_logo?: string;
	category: string;
	tags: string[];
	job_type: string;
	publication_date: string;
	candidate_required_location: string;
	salary: string;
	description: string;
}

export interface RemotiveResponse {
	"job-count": number;
	jobs: RemotiveJob[];
}

export interface Job {
	id: string;
	url: string;
	title: string;
	company: string;
	category: JobCategory;
	description: string;
	tags: string[];
	location: string;
	postedAt: string;
	salary?: string;
	isRemote: boolean;
}
