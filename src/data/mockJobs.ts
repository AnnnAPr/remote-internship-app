import { Job } from "../types/job";

export const mockJobs: Job[] = [
	{
		"id": "other-1",
		"url": "https://example.com/apply/other-1",
		"title": "Product Marketing Intern",
		"company": "Zendesk",
		"category": "other",
		"description": "Draft messaging and plan launches.",
		"tags": ["Marketing"],
		"location": "Remote",
		"postedAt": "2026-04-01T03:43:19.768Z",
		"isRemote": true
	},
	{
		"id": "gen-1",
		"url": "https://jobs.example.com/apply/intern-1",
		"title": "Data Engineering Internship",
		"company": "Notion",
		"category": "backend",
		"description": "Join our team as a backend intern. You will work on production systems, collaborate with cross-functional teams, and contribute to meaningful projects. This remote position offers a competitive hourly rate and professional career mentorship from senior engineers.",
		"tags": [
			"Rust",
			"Figma",
			"React",
			"Python"
		],
		"location": "Remote (Americas/EMEA)",
		"postedAt": "2026-04-01T03:43:19.768Z",
		"salary": "$36/hr",
		"isRemote": true
	},
	{
		"id": "gen-2",
		"url": "https://jobs.example.com/apply/intern-2",
		"title": "Cloud Infrastructure Intern",
		"company": "GitHub",
		"category": "ai",
		"description": "Join our team as a ai intern. You will work on production systems, collaborate with cross-functional teams, and contribute to meaningful projects. This remote position offers a competitive hourly rate and professional career mentorship from senior engineers.",
		"tags": [
			"AWS",
			"GraphQL",
			"Go",
			"Redis"
		],
		"location": "Remote (Americas/EMEA)",
		"postedAt": "2026-03-25T03:43:19.769Z",
		"salary": "$41/hr",
		"isRemote": true
	},
	{
		"id": "gen-3",
		"url": "https://jobs.example.com/apply/intern-3",
		"title": "Frontend Developer Internship",
		"company": "Vercel",
		"category": "fullstack",
		"description": "Join our team as a fullstack intern. You will work on production systems, collaborate with cross-functional teams, and contribute to meaningful projects. This remote position offers a competitive hourly rate and professional career mentorship from senior engineers.",
		"tags": [
			"Docker",
			"GraphQL",
			"Python"
		],
		"location": "US Remote",
		"postedAt": "2026-03-27T03:43:19.769Z",
		"salary": "$45/hr",
		"isRemote": true
	},
	{
		"id": "gen-4",
		"url": "https://jobs.example.com/apply/intern-4",
		"title": "Frontend Developer Internship",
		"company": "Notion",
		"category": "frontend",
		"description": "Join our team as a frontend intern. You will work on production systems, collaborate with cross-functional teams, and contribute to meaningful projects. This remote position offers a competitive hourly rate and professional career mentorship from senior engineers.",
		"tags": [
			"Rust",
			"Figma",
			"Tailwind CSS"
		],
		"location": "EU Remote",
		"postedAt": "2026-03-28T03:43:19.769Z",
		"salary": "$39/hr",
		"isRemote": true
	}
]