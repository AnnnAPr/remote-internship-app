"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Job } from "@/types/job";
import JobCard from "@/components/JobCard";
import { Loader2 } from "lucide-react";

function HomeContent() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const initialSearch = searchParams.get("query") || "";

	const [jobs, setJobs] = useState<Job[]>([]);
	const [searchInput, setSearchInput] = useState(initialSearch);
	const [activeSearchQuery, setActiveSearchQuery] = useState(initialSearch);
	const [hasSearched, setHasSearched] = useState(!!initialSearch);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchJobs = async () => {
			setIsLoading(true);
			try {
				const res = await fetch("/api/jobs");
				const data = await res.json();
				console.log("DATA FROM API:", JSON.stringify(data, null, 2));
				console.log("data.jobs: ", data.jobs);
				if (data.jobs) setJobs(data.jobs);
			} catch (error) {
				console.error("Failed to fetch jobs:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchJobs();
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchInput.trim()) return;
		console.log('searchInput: ', searchInput);
		setActiveSearchQuery(searchInput);
		setHasSearched(true);
		const params = new URLSearchParams(searchParams.toString());
		params.set("query", searchInput);
		router.push(`${pathname}?${params.toString()}`);
	};

	const handleReset = () => {
		setSearchInput("");
		setActiveSearchQuery("");
		setHasSearched(false);
		router.push(pathname);
	}

	const filteredJobs = useMemo(() => {
		if (!activeSearchQuery.trim()) return [];
		const query = activeSearchQuery.toLowerCase();
		return jobs.filter(job =>
			job.title.toLowerCase().includes(query) ||
			job.company.toLowerCase().includes(query) ||
			job.category.toLowerCase().includes(query) ||
			job.description.toLowerCase().includes(query)
		);
	}, [jobs, activeSearchQuery]);

	return (
		<main className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30 px-6 py-20 flex flex-col items-start max-w-7xl mx-0">
			<header className="w-full max-w-4xl mb-16 flex flex-col items-start">
				<h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
					Remote Internship Search
				</h1>

				<p className="text-lg text-zinc-500 mb-10 max-w-2xl">
					Find software engineering and data roles from top global companies.
				</p>

				<form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row gap-4 justify-start items-start">
					<div className="relative w-full max-w-lg">
						<input
							type="text"
							placeholder="Enter keyword (e.g. 'Frontend')..."
							className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-lg focus:border-zinc-600 outline-none transition-colors"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</div>
					<button type="submit" className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3 px-8 rounded-lg transition-all active:scale-98">
						Search Jobs
					</button>

					{hasSearched && (
						<button 
							type="button"
							onClick={handleReset}
							className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-8 rounded-lg transition-all active:scale-98"
						>
							Reset
						</button>
					)}
				</form>
			</header>

			{/* Main Content after user's search*/}
			<section className="w-full max-w-6xl flex flex-col items-start">
				{!hasSearched ? (
					<div className="w-full py-12 border border-zinc-900 rounded-xl">
						<p className="text-zinc-500 px-8">Ready to search? Enter a keyword above.</p>
					</div>
				) : (
					<div className="w-full">
						<div className="mb-8">
							<p className="text-zinc-500">
								<span className="text-white font-bold">{filteredJobs.length}</span> results found for &quot;{activeSearchQuery}&quot;
							</p>
						</div>

						{isLoading ? (
							<div className="flex flex-row items-center gap-3 py-10 text-zinc-500">
								<Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
								<p>Loading internships...</p>
							</div>
						) : filteredJobs.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredJobs.map((job) => (
									<JobCard
										key={job.id}
										job={job}
									/>
								))}
							</div>
						) : (
							<p className="text-zinc-500 py-6">No jobs found matching your search. Try different keyword.</p>
						)}
					</div>
				)}
			</section>

		</main>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center p-10"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>}>
			<HomeContent />
		</Suspense>
	);
}
